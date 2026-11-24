import { Router } from "express";
import {
  SESSION_COOKIE,
  SESSION_DURATION,
  sessionCookieOptions,
  clearSessionCookie,
  createSessionAuthenticate,
} from "../../services/session.js";

export const createSessionRouter = (auth, findUser) => {
  const router = Router();
  router.post("/api/auth/session", async (req, res) => {
    try {
      const { idToken } = req.body ?? {};
      if (typeof idToken !== "string" || !idToken)
        return res.status(400).json({ error: "A sign-in token is required" });
      const claims = await auth.verifyIdToken(idToken, true);
      const age = Date.now() / 1000 - claims.auth_time;
      if (
        !Number.isFinite(age) ||
        age < -60 ||
        age > 300 ||
        !claims.email_verified
      ) {
        return res
          .status(401)
          .json({ error: "Sign in again with a verified email" });
      }
      const user = await findUser(claims.uid);
      if (!user)
        return res.status(404).json({ error: "User profile not found" });
      const session = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION,
      });
      res.cookie(SESSION_COOKIE, session, {
        ...sessionCookieOptions,
        maxAge: SESSION_DURATION,
      });
      res.json({ users: user });
    } catch {
      res
        .status(401)
        .json({ error: "Unable to create a session. Sign in again." });
    }
  });
  router.get(
    "/api/auth/session",
    createSessionAuthenticate(auth),
    async (req, res) => {
      try {
        const user = await findUser(req.user.uid);
        if (!user) {
          clearSessionCookie(res);
          return res
            .status(401)
            .json({ error: "User profile no longer exists" });
        }
        res.json({ users: user });
      } catch {
        res.status(503).json({ error: "Unable to load your profile" });
      }
    },
  );
  router.post("/api/auth/logout", (_req, res) => {
    clearSessionCookie(res);
    res.sendStatus(204);
  });
  return router;
};
