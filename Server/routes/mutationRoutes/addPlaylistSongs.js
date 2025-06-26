import { Router } from "express";
import { ADD_PLAYLIST_SONG } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/addPlaylistSong", async (req, res) => {
  try {
    const { playlist_id, song_id } = req.body;
    const response = await client.request(ADD_PLAYLIST_SONG, {
      playlist_id,
      song_id,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating playlist songs", error);
    res.status(500).json("Error updating playlist songs");
  }
});

export default router;
