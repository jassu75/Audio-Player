import { Router } from "express";
import { UPDATE_PLAYLIST_SONGS } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/updatePlaylistSong", async (req, res) => {
  try {
    const { playlist_id, playlist_songs } = req.body;
    const response = await client.request(UPDATE_PLAYLIST_SONGS, {
      playlist_id,
      playlist_songs,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating playlist songs", error);
    res.status(500).json("Error updating playlist songs");
  }
});

export default router;
