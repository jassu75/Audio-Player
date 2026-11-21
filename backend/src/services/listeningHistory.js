import { Router } from "express";
import { FETCH_LISTENED_SONGS, FETCH_PLAY_EVENTS, FIND_ACCESSIBLE_SONG } from "../graphql/queries.js";
import { RECORD_PLAY_EVENT } from "../graphql/mutations.js";

const isUuid = value => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
export const normalizeSong = song => ({ ...song, genre: Array.isArray(song.genre) ? song.genre : [], release_year: song.release_year ?? "" });

export const canAccessSong = async (client, userId, songId) => {
    if (!isUuid(songId)) return false;
    const response = await client.request(FIND_ACCESSIBLE_SONG, { user_id: userId, song_id: songId });
    return response.songs.length > 0;
};

export const getListeningHistory = async (client, userId, order) => {
    const before = new Date().toISOString();
    const activity = new Map();
    let cursor = {};
    while (true) {
        const { events } = await client.request(FETCH_PLAY_EVENTS, { user_id: userId, before, cursor, limit: 1000 });
        for (const event of events) {
            const previous = activity.get(event.song_id);
            if (!previous) {
                activity.set(event.song_id, { song_id: event.song_id, listens: 1, last_played: event.played_at });
            } else {
                previous.listens++;
                if (Date.parse(event.played_at) > Date.parse(previous.last_played)) previous.last_played = event.played_at;
            }
        }
        if (events.length < 1000) break;
        cursor = { id: { _gt: events.at(-1).id } };
    }
    const ranked = [...activity.values()].sort((left, right) =>
        (order === "most" ? right.listens - left.listens : 0)
        || Date.parse(right.last_played) - Date.parse(left.last_played)
        || left.song_id.localeCompare(right.song_id));
    const result = [];
    for (let offset = 0; offset < ranked.length && result.length < 50; offset += 100) {
        const batch = ranked.slice(offset, offset + 100);
        const { songs } = await client.request(FETCH_LISTENED_SONGS, { user_id: userId, song_ids: batch.map(item => item.song_id), limit: 100 });
        const available = new Map(songs.map(song => [song.song_id, song]));
        for (const item of batch) {
            const song = available.get(item.song_id);
            if (song) result.push({ ...normalizeSong(song), last_played: item.last_played, listens: item.listens });
            if (result.length === 50) break;
        }
    }
    return result;
};

export const createListeningHistoryRouter = client => {
    const router = Router();
    router.post("/api/play-events", async (req, res) => {
        const { event_id, song_id, user_id } = req.body ?? {};
        if (!isUuid(event_id) || !isUuid(song_id)) return res.status(400).json({ error: "Valid event and song IDs are required" });
        if (user_id !== req.user.uid) return res.status(403).json({ error: "User does not match the session" });
        try {
            if (!await canAccessSong(client, req.user.uid, song_id)) return res.status(403).json({ error: "Track is not available in your library" });
            await client.request(RECORD_PLAY_EVENT, { event_id, song_id, user_id: req.user.uid, played_at: new Date().toISOString() });
            res.json({ recorded: true });
        } catch {
            res.status(503).json({ error: "Unable to record playback" });
        }
    });
    for (const [path, order, key] of [
        ["/api/fetchrecentlyplayed", "recent", "recently_played"],
        ["/api/fetchMostListened", "most", "most_listened"],
    ]) {
        router.post(path, async (req, res) => {
            try {
                const songs = await getListeningHistory(client, req.user.uid, order);
                res.json({ [key]: songs });
            } catch {
                res.status(503).json({ error: "Unable to load your listening history" });
            }
        });
    }
    return router;
};
