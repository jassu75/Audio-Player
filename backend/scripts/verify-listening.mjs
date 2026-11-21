import "../src/Config/config.js";
import { readFile } from "node:fs/promises";
import client from "../src/Config/hasura.js";
import { FIND_ACCESSIBLE_SONG, FETCH_SEARCH_SONGS, FETCH_PLAYLIST_SONGS, FETCH_FAVORITES, FETCH_PLAY_EVENTS, FETCH_LISTENED_SONGS } from "../src/graphql/queries.js";
import { RECORD_PLAY_EVENT } from "../src/graphql/mutations.js";
import { getListeningHistory } from "../src/services/listeningHistory.js";

const user_id = "verify-listening-schema-user";
const uuid = "00000000-0000-4000-8000-000000000000";
const sharedSearch = await client.request(FETCH_SEARCH_SONGS, { user_id, search_text: "%" });
if (!sharedSearch.searchResults.length || sharedSearch.searchResults.some(song => song.user_id !== null || song.source === "user")) {
    throw new Error("Shared search omitted system audio or exposed another user's uploads");
}
const accessible = await client.request(FIND_ACCESSIBLE_SONG, { user_id, song_id: sharedSearch.searchResults[0].song_id });
if (accessible.songs.length !== 1) throw new Error("System audio is not available for favorites and playback tracking");
console.log("Verified live search includes system audio and excludes private uploads.");
for (const [name, query, variables] of [
    ["search", FETCH_SEARCH_SONGS, { user_id, search_text: "verify-no-matching-audio-6ed159fd" }],
    ["playlist songs", FETCH_PLAYLIST_SONGS, { user_id, playlist_id: uuid }],
    ["favorites", FETCH_FAVORITES, { user_id }],
    ["play events", FETCH_PLAY_EVENTS, { user_id, before: new Date().toISOString(), cursor: {}, limit: 1000 }],
    ["listened songs", FETCH_LISTENED_SONGS, { user_id, song_ids: [uuid], limit: 100 }],
    ["track visibility", FIND_ACCESSIBLE_SONG, { user_id, song_id: uuid }],
]) {
    await client.request(query, variables);
    console.log(`Validated ${name} query against Hasura.`);
}
for (const order of ["recent", "most"]) {
    const history = await getListeningHistory(client, user_id, order);
    if (history.length) throw new Error("An empty user history returned another listener's audio");
}
console.log("Validated direct-event history reads with no summary view.");
const skippedMutation = RECORD_PLAY_EVENT.replace(") { id }", ") @skip(if: true) { id }");
if (skippedMutation === RECORD_PLAY_EVENT) throw new Error("Cannot safely skip the play-event mutation during validation");
await client.request(skippedMutation, { event_id: uuid, song_id: uuid, user_id, played_at: new Date().toISOString() });
console.log("Validated play-event mutation without writing an event.");
const sql = await readFile(new URL("../migrations/20261120_unified_listening/verify.sql", import.meta.url), "utf8");
const url = new URL(process.env.HASURA_URL);
url.pathname = "/v1/metadata";
const headers = { "Content-Type": "application/json", "x-hasura-admin-secret": process.env.HASURA_SECRET_KEY };
const metadataResponse = await fetch(url, { method: "POST", headers, body: JSON.stringify({ type: "export_metadata", args: {} }) });
if (!metadataResponse.ok) throw new Error("Unable to discover the listening-history database source");
const metadata = await metadataResponse.json();
const source = metadata.sources.find(item => item.kind === "postgres" && item.tables.some(table => table.table.schema === "public" && table.table.name === "play_events"));
if (!source) throw new Error("Listening-history migration has not been applied");
if (source.tables.some(table => table.table.schema === "public" && table.table.name === "user_song_activity")) throw new Error("The summary view is still tracked in Hasura");
url.pathname = "/v2/query";
const response = await fetch(url, {
    method: "POST", headers,
    body: JSON.stringify({ type: "run_sql", args: { source: source.name, sql, check_metadata_consistency: false } }),
});
const result = await response.json();
if (!response.ok) throw new Error(result.internal?.error?.message ?? result.error ?? "Database verification failed");
console.log("Verified direct-event counts, account isolation, duplicate-event handling, ordering, deletion cleanup, and absence of the summary view. All verification fixtures were rolled back.");
