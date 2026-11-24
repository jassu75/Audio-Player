import { Router } from "express";
import { FETCH_USER_SONGS_RANDOMLY } from "../graphql/queries.js";
import { normalizeSong } from "./listeningHistory.js";

export const createRandomSongsRouter = (client) => {
  const router = Router();
  router.post("/api/fetchrandomsongs", async (req, res) => {
    try {
      const user_id = req.user.uid;
      const response = await client.request(FETCH_USER_SONGS_RANDOMLY, {
        user_id,
      });
      const songs = response.randomSongs.filter(
        (song) =>
          song.user_id === user_id ||
          (song.user_id === null && song.source !== "user"),
      );
      res.json({ randomSongs: songs.slice(0, 50).map(normalizeSong) });
    } catch {
      res.status(503).json({ error: "Unable to load random songs" });
    }
  });
  return router;
};
