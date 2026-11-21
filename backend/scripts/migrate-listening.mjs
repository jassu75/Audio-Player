import "../src/Config/config.js";
import { readFile } from "node:fs/promises";

const endpoint = new URL(process.env.HASURA_URL);
const headers = { "Content-Type": "application/json", "x-hasura-admin-secret": process.env.HASURA_SECRET_KEY };
const call = async (path, type, args) => {
    const url = new URL(endpoint);
    url.pathname = path;
    const response = await fetch(url, { method: "POST", headers, body: JSON.stringify({ type, args }) });
    const result = await response.json();
    if (!response.ok) throw new Error(`${type} failed: ${result.error ?? response.status}`);
    return result;
};
const metadata = await call("/v1/metadata", "export_metadata", {});
const source = metadata.sources.find(item => item.kind === "postgres" && item.tables.some(table => table.table.schema === "public" && table.table.name === "play_events"));
if (!source) throw new Error("No tracked play_events table was found");
const sql = await readFile(new URL("../migrations/20261120_unified_listening/up.sql", import.meta.url), "utf8");
const table = { schema: "public", name: "user_song_activity" };
const tracked = source.tables.find(item => item.table.schema === table.schema && item.table.name === table.name);
if (tracked) await call("/v1/metadata", "pg_untrack_table", { source: source.name, table, cascade: false });
await call("/v2/query", "run_sql", { source: source.name, sql });
console.log("Configured play-event tracking and removed the summary view. History is queried directly from play_events.");
