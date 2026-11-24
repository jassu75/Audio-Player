import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { once } from "node:events";
import { spawnSync } from "node:child_process";
import { createSessionRouter } from "../routes/auth/session.js";
import {
  SESSION_COOKIE,
  SESSION_DURATION,
  createSessionAuthenticate,
  requireSameOriginRequest,
} from "./session.js";

const profile = {
  user_id: "u1",
  username: "Listener",
  email_id: "listener@example.com",
};
const claims = () => ({
  uid: "u1",
  email_verified: true,
  auth_time: Math.floor(Date.now() / 1000),
});

const setup = async (context, overrides = {}) => {
  const calls = [];
  const auth = {
    verifyIdToken: async (token, revoked) => {
      calls.push(["id", token, revoked]);
      return claims();
    },
    createSessionCookie: async (token, options) => {
      calls.push(["create", token, options]);
      return "signed-session";
    },
    verifySessionCookie: async (cookie, revoked) => {
      calls.push(["session", cookie, revoked]);
      return claims();
    },
    ...overrides,
  };
  const app = express();
  app.use(express.json());
  app.use(requireSameOriginRequest);
  app.use(createSessionRouter(auth, async () => profile));
  app.use(createSessionAuthenticate(auth));
  app.post("/protected", (req, res) => res.json({ uid: req.user.uid }));
  const server = app.listen(0, "127.0.0.1");
  context.after(() => new Promise((resolve) => server.close(resolve)));
  await once(server, "listening");
  const request = (path, options = {}) =>
    fetch(`http://127.0.0.1:${server.address().port}${path}`, options);
  return { request, calls };
};
const post = (body = {}, headers = {}) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Musify-Request": "1",
    ...headers,
  },
  body: JSON.stringify(body),
});

test("login exchanges a recent verified token for an HttpOnly session cookie", async (context) => {
  const { request, calls } = await setup(context);
  const response = await request(
    "/api/auth/session",
    post({ idToken: "firebase-id-token" }),
  );
  assert.equal(response.status, 200);
  const cookie = response.headers.get("set-cookie");
  assert.match(cookie, new RegExp(`^${SESSION_COOKIE}=signed-session;`));
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Path=\//);
  assert.match(cookie, /Max-Age=604800/);
  assert.doesNotMatch(cookie, /Domain=/);
  assert.deepEqual(await response.json(), { users: profile });
  assert.deepEqual(calls, [
    ["id", "firebase-id-token", true],
    ["create", "firebase-id-token", { expiresIn: SESSION_DURATION }],
  ]);
});

test("restoring a profile verifies the cookie and checks revocation", async (context) => {
  const { request, calls } = await setup(context);
  const response = await request("/api/auth/session", {
    headers: { Cookie: `${SESSION_COOKIE}=signed-session` },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { users: profile });
  assert.deepEqual(calls, [["session", "signed-session", true]]);
});

test("missing, tampered, expired, and revoked cookies cannot authenticate", async (context) => {
  const { request } = await setup(context, {
    verifySessionCookie: async () => {
      throw new Error("invalid cookie");
    },
  });
  for (const cookie of [
    "",
    `${SESSION_COOKIE}=forged`,
    `${SESSION_COOKIE}=%invalid`,
  ]) {
    const response = await request("/api/auth/session", {
      headers: { Cookie: cookie },
    });
    assert.equal(response.status, 401);
  }
  const response = await request("/api/auth/session", {
    headers: { Authorization: "Bearer temporary-token" },
  });
  assert.equal(response.status, 401);
});

test("expired login tokens and unverified emails cannot create sessions", async (context) => {
  for (const tokenClaims of [
    { ...claims(), auth_time: 1 },
    { ...claims(), email_verified: false },
  ]) {
    const { request, calls } = await setup(context, {
      verifyIdToken: async () => tokenClaims,
    });
    const response = await request(
      "/api/auth/session",
      post({ idToken: "token" }),
    );
    assert.equal(response.status, 401);
    assert.equal(response.headers.get("set-cookie"), null);
    assert.deepEqual(calls, []);
  }
});

test("cross-site and simple form requests are rejected before authentication", async (context) => {
  const { request, calls } = await setup(context);
  const simple = await request("/api/auth/session", {
    method: "POST",
    body: "idToken=token",
  });
  assert.equal(simple.status, 403);
  const crossSite = await request(
    "/api/auth/logout",
    post({}, { "Sec-Fetch-Site": "cross-site" }),
  );
  assert.equal(crossSite.status, 403);
  assert.deepEqual(calls, []);
});

test("a cookie cannot be used with a different user ID", async (context) => {
  const { request } = await setup(context);
  const response = await request(
    "/protected",
    post(
      { user_id: "someone-else" },
      { Cookie: `${SESSION_COOKIE}=signed-session` },
    ),
  );
  assert.equal(response.status, 403);
  for (const body of [
    { uploadedSong: { user_id: "someone-else" } },
    { uploadPlaylist: { user_id: "someone-else" } },
  ]) {
    const attempt = await request(
      "/protected",
      post(body, { Cookie: `${SESSION_COOKIE}=signed-session` }),
    );
    assert.equal(attempt.status, 403);
  }
  const own = await request(
    "/protected",
    post({ user_id: "u1" }, { Cookie: `${SESSION_COOKIE}=signed-session` }),
  );
  assert.equal(own.status, 200);
});

test("production cookies require HTTPS and the host-only prefix", () => {
  const moduleUrl = new URL("./session.js", import.meta.url).href;
  const result = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `const session = await import(${JSON.stringify(moduleUrl)}); console.log(JSON.stringify({ name: session.SESSION_COOKIE, options: session.sessionCookieOptions }));`,
    ],
    {
      encoding: "utf8",
      env: { ...process.env, NODE_ENV: "production" },
    },
  );
  assert.equal(result.status, 0, result.stderr);
  const cookie = JSON.parse(result.stdout);
  assert.equal(cookie.name, "__Host-musify_session");
  assert.deepEqual(cookie.options, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
});

test("logout clears the HttpOnly cookie even when the session has expired", async (context) => {
  const { request } = await setup(context);
  const response = await request("/api/auth/logout", post());
  assert.equal(response.status, 204);
  assert.match(response.headers.get("set-cookie"), /Expires=Thu, 01 Jan 1970/);
  assert.match(response.headers.get("set-cookie"), /HttpOnly/);
});
