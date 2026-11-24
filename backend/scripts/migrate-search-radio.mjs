import "../src/Config/config.js";
import { readFile } from "node:fs/promises";

const url = new URL(process.env.HASURA_URL);
const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": process.env.HASURA_SECRET_KEY,
};
url.pathname = "/v1/metadata";
const metadataResponse = await fetch(url, {
  method: "POST",
  headers,
  body: JSON.stringify({ type: "export_metadata", args: {} }),
});
if (!metadataResponse.ok)
  throw new Error("Unable to discover the audio database source");
const metadata = await metadataResponse.json();
const source = metadata.sources.find(
  (item) =>
    item.kind === "postgres" &&
    item.tables.some(
      (table) =>
        table.table.schema === "public" && table.table.name === "audio_details",
    ),
);
if (!source) throw new Error("No tracked audio_details table was found");
const sql = await readFile(
  new URL("../migrations/20261120_search_radio/up.sql", import.meta.url),
  "utf8",
);
url.pathname = "/v2/query";
const response = await fetch(url, {
  method: "POST",
  headers,
  body: JSON.stringify({ type: "run_sql", args: { source: source.name, sql } }),
});
const result = await response.json();
if (!response.ok)
  throw new Error(
    result.internal?.error?.message ??
      result.error ??
      "Random-song function migration failed",
  );
console.log(
  "Updated the existing random-song function to include uploaded and shared database audio.",
);
