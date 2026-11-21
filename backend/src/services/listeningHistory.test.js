import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { once } from "node:events";
import { createListeningHistoryRouter, getListeningHistory } from "./listeningHistory.js";
import { FIND_ACCESSIBLE_SONG, FETCH_LISTENED_SONGS, FETCH_PLAY_EVENTS } from "../graphql/queries.js";
import { RECORD_PLAY_EVENT } from "../graphql/mutations.js";

const songId = "11111111-1111-4111-8111-111111111111";
const eventId = "22222222-2222-4222-8222-222222222222";
const setup = async (context, request) => {
    const calls = [];
    const client = { request: async (query, variables) => { calls.push({ query, variables }); return request(query, variables); } };
    const app = express();
    app.use(express.json());
    app.use((req, _res, next) => { req.user = { uid: "listener-one" }; next(); });
    app.use(createListeningHistoryRouter(client));
    const server = app.listen(0, "127.0.0.1");
    context.after(() => new Promise(resolve => server.close(resolve)));
    await once(server, "listening");
    const post = (path, body = {}) => fetch(`http://127.0.0.1:${server.address().port}${path}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    return { post, calls };
};

test("playback records the session user and a server timestamp after checking track access", async context => {
    const { post, calls } = await setup(context, async query => query === FIND_ACCESSIBLE_SONG ? { songs: [{ song_id: songId }] } : { insert_play_events_one: { id: eventId } });
    const response = await post("/api/play-events", { song_id: songId, event_id: eventId, user_id: "listener-one", played_at: "2000-01-01" });
    assert.equal(response.status, 200);
    assert.equal(calls[0].query, FIND_ACCESSIBLE_SONG);
    assert.deepEqual(calls[0].variables, { song_id: songId, user_id: "listener-one" });
    assert.equal(calls[1].query, RECORD_PLAY_EVENT);
    assert.equal(calls[1].variables.event_id, eventId);
    assert.equal(calls[1].variables.user_id, "listener-one");
    assert.notEqual(calls[1].variables.played_at, "2000-01-01");
    assert.ok(Number.isFinite(Date.parse(calls[1].variables.played_at)));
});

test("another account or a private inaccessible track cannot add listening history", async context => {
    const { post, calls } = await setup(context, async () => ({ songs: [] }));
    const spoofed = await post("/api/play-events", { song_id: songId, event_id: eventId, user_id: "listener-two" });
    assert.equal(spoofed.status, 403);
    assert.equal(calls.length, 0);
    const inaccessible = await post("/api/play-events", { song_id: songId, event_id: eventId, user_id: "listener-one" });
    assert.equal(inaccessible.status, 403);
    assert.equal(calls.length, 1);
    assert.notEqual(calls[0].query, RECORD_PLAY_EVENT);
});

test("malformed event IDs are rejected before reaching the database", async context => {
    const { post, calls } = await setup(context, async () => { throw new Error("Unexpected database call"); });
    const response = await post("/api/play-events", { song_id: songId, event_id: "bad-id", user_id: "listener-one" });
    assert.equal(response.status, 400);
    assert.equal(calls.length, 0);
});

test("history combines uploaded and system audio using listener-specific counts and timestamps", async context => {
    const { post, calls } = await setup(context, async query => query === FETCH_PLAY_EVENTS ? { events: [
        { id: "1", song_id: songId, played_at: "2026-11-20T20:00:00Z" },
        { id: "2", song_id: "owned", played_at: "2026-11-20T19:00:00Z" },
        { id: "3", song_id: songId, played_at: "2026-11-20T18:00:00Z" },
    ] } : { songs: [
        { song_id: "owned", source: "user", genre: ["Pop"], release_year: "2026", listens: 1000 },
        { song_id: songId, source: "system", last_played: "global", listens: 999, genre: null, release_year: null },
    ] });
    for (const [path, key] of [["/api/fetchrecentlyplayed", "recently_played"], ["/api/fetchMostListened", "most_listened"]]) {
        const response = await post(path, { user_id: "listener-two" });
        assert.equal(response.status, 200);
        const songs = (await response.json())[key];
        assert.deepEqual(songs.map(song => song.source), ["system", "user"]);
        assert.equal(songs[0].listens, 2);
        assert.equal(songs[0].last_played, "2026-11-20T20:00:00Z");
        assert.deepEqual(songs[0].genre, []);
        assert.equal(songs[1].listens, 1);
        assert.ok(calls.every(call => call.variables.user_id === "listener-one"));
    }
});

test("history counts every event across cursor pages before ranking the top tracks", async () => {
    const firstPage = Array.from({ length: 1000 }, (_, index) => ({ id: String(index), song_id: "frequent", played_at: "2026-11-19T10:00:00Z" }));
    const eventCalls = [];
    const client = { request: async (query, variables) => {
        if (query === FETCH_PLAY_EVENTS) {
            eventCalls.push(variables);
            return { events: eventCalls.length === 1 ? firstPage : [{ id: "1001", song_id: "recent", played_at: "2026-11-20T10:00:00Z" }] };
        }
        assert.equal(query, FETCH_LISTENED_SONGS);
        return { songs: [{ song_id: "recent" }, { song_id: "frequent" }] };
    } };
    const songs = await getListeningHistory(client, "listener", "most");
    assert.deepEqual(songs.map(song => [song.song_id, song.listens]), [["frequent", 1000], ["recent", 1]]);
    assert.deepEqual(eventCalls[0].cursor, {});
    assert.deepEqual(eventCalls[1].cursor, { id: { _gt: "999" } });
    assert.equal(eventCalls[0].before, eventCalls[1].before);
});

test("recent history orders by latest event rather than total plays or song metadata", async () => {
    const client = { request: async query => query === FETCH_PLAY_EVENTS ? { events: [
        { song_id: "old", played_at: "2026-11-19T10:00:00Z" },
        { song_id: "old", played_at: "2026-11-19T12:00:00Z" },
        { song_id: "new", played_at: "2026-11-20T10:00:00Z" },
    ] } : { songs: [{ song_id: "old", last_played: "2026-11-21T10:00:00Z" }, { song_id: "new" }] } };
    const songs = await getListeningHistory(client, "listener", "recent");
    assert.deepEqual(songs.map(song => song.song_id), ["new", "old"]);
    assert.equal(songs[1].last_played, "2026-11-19T12:00:00Z");
});

test("unavailable tracks do not prevent later accessible tracks from filling the list", async () => {
    const songIds = Array.from({ length: 105 }, (_, index) => String(index).padStart(3, "0"));
    const batches = [];
    const client = { request: async (query, variables) => {
        if (query === FETCH_PLAY_EVENTS) return { events: songIds.map(song_id => ({ song_id, played_at: "2026-11-20T10:00:00Z" })) };
        batches.push(variables.song_ids);
        return { songs: batches.length === 1 ? [] : variables.song_ids.map(song_id => ({ song_id })) };
    } };
    const songs = await getListeningHistory(client, "listener", "most");
    assert.deepEqual(batches.map(batch => batch.length), [100, 5]);
    assert.deepEqual(songs.map(song => song.song_id), songIds.slice(100));
});

test("an empty event history does not load unrelated audio or global legacy counts", async () => {
    let calls = 0;
    const client = { request: async query => { calls++; assert.equal(query, FETCH_PLAY_EVENTS); return { events: [] }; } };
    assert.deepEqual(await getListeningHistory(client, "listener", "most"), []);
    assert.equal(calls, 1);
});

test("a failed history write reports failure so the event can be retried", async context => {
    const { post } = await setup(context, async query => {
        if (query === FIND_ACCESSIBLE_SONG) return { songs: [{ song_id: songId }] };
        throw new Error("offline");
    });
    const response = await post("/api/play-events", { song_id: songId, event_id: eventId, user_id: "listener-one" });
    assert.equal(response.status, 503);
});
