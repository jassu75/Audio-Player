import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { once } from "node:events";
import { createRandomSongsRouter } from "./randomSongs.js";
import { FETCH_USER_SONGS_RANDOMLY } from "../graphql/queries.js";

const setup = async (context, request) => {
    const app = express();
    app.use(express.json());
    app.use((req, _res, next) => { req.user = { uid: "listener" }; next(); });
    app.use(createRandomSongsRouter({ request }));
    const server = app.listen(0, "127.0.0.1");
    context.after(() => new Promise(resolve => server.close(resolve)));
    await once(server, "listening");
    return body => fetch(`http://127.0.0.1:${server.address().port}/api/fetchrandomsongs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
};

test("random-song requests use the session user and combine owned and shared database tracks", async context => {
    const post = await setup(context, async (query, variables) => {
        assert.equal(query, FETCH_USER_SONGS_RANDOMLY);
        assert.deepEqual(variables, { user_id: "listener" });
        return { randomSongs: [
            { song_id: "owned", user_id: "listener", source: "user", genre: null, release_year: null },
            { song_id: "shared", user_id: null, source: "system" },
            { song_id: "private", user_id: "someone-else", source: "user" },
        ] };
    });
    const response = await post({ user_id: "someone-else" });
    assert.equal(response.status, 200);
    const { randomSongs } = await response.json();
    assert.deepEqual(randomSongs.map(song => song.song_id), ["owned", "shared"]);
    assert.deepEqual(randomSongs[0].genre, []);
    assert.equal(randomSongs[0].release_year, "");
});

test("random-song failure returns an error without an invalid queue", async context => {
    const post = await setup(context, async () => { throw new Error("offline"); });
    const response = await post({});
    assert.equal(response.status, 503);
    assert.equal((await response.json()).error, "Unable to load random songs");
});
