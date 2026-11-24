export const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;
const production =
  process.env.NODE_ENV === "production" || Boolean(process.env.GAE_ENV);
export const SESSION_COOKIE = production
  ? "__Host-musify_session"
  : "musify_session";
export const sessionCookieOptions = {
  httpOnly: true,
  secure: production,
  sameSite: "lax",
  path: "/",
};

export const readSessionCookie = (req) => {
  const cookie = req.headers.cookie
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${SESSION_COOKIE}=`));
  if (!cookie) return null;
  try {
    return decodeURIComponent(cookie.slice(SESSION_COOKIE.length + 1));
  } catch {
    return null;
  }
};

export const clearSessionCookie = (res) =>
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions);

export const requireSameOriginRequest = (req, res, next) => {
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    (req.get("X-Musify-Request") !== "1" ||
      req.get("Sec-Fetch-Site") === "cross-site")
  ) {
    return res
      .status(403)
      .json({ error: "Request origin could not be verified" });
  }
  next();
};

export const createSessionAuthenticate = (auth) => async (req, res, next) => {
  if (req.user) return next();
  try {
    const cookie = readSessionCookie(req);
    if (!cookie) return res.status(401).json({ error: "Sign in to continue" });
    req.user = await auth.verifySessionCookie(cookie, true);
    if (!req.user.email_verified)
      throw new Error("Email verification required");
    const suppliedUserIds = [
      req.body?.user_id,
      req.body?.uploadedSong?.user_id,
      req.body?.uploadPlaylist?.user_id,
    ];
    if (
      suppliedUserIds.some(
        (userId) => userId !== undefined && userId !== req.user.uid,
      )
    ) {
      return res.status(403).json({ error: "User does not match the session" });
    }
    next();
  } catch {
    clearSessionCookie(res);
    res.status(401).json({ error: "Your session expired. Sign in again." });
  }
};
