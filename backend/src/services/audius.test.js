import test from "node:test";
import assert from "node:assert/strict";
import { getAudiusUrl } from "./audius.js";

test("concurrent requests share discovery and reuse the cached host", async () => {
  const app = { locals: {} };
  let calls = 0;
  const request = async () => {
    calls++;
    return { data: { data: ["https://music.example"] } };
  };
  assert.deepEqual(await Promise.all([getAudiusUrl(app, request), getAudiusUrl(app, request)]), [
    "https://music.example", "https://music.example",
  ]);
  assert.equal(await getAudiusUrl(app, request), "https://music.example");
  assert.equal(calls, 1);
});

test("failed discovery can retry instead of blocking future requests", async () => {
  const app = { locals: {} };
  await assert.rejects(getAudiusUrl(app, async () => { throw new Error("offline"); }), /offline/);
  assert.equal(await getAudiusUrl(app, async () => ({ data: { data: ["https://recovered.example"] } })), "https://recovered.example");
});

test("discovery rejects missing hosts", async () => {
  await assert.rejects(getAudiusUrl({ locals: {} }, async () => ({ data: { data: [] } })), /no usable server/);
});
