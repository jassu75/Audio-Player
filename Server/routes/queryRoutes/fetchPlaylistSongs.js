import { Router } from "express";
import { FETCH_PLAYLIST_SONGS } from "../../queries.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/fetchPlaylistSongs", async (req, res) => {
  try {
    const { playlist_id } = req.body;
    const response = await client.request(FETCH_PLAYLIST_SONGS, {
      playlist_id,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching songs", error);
    res.status(500).json("Error fetching songs");
  }
});

export default router;
