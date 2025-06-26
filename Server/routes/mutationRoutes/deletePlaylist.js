import { Router } from "express";
import { DELETE_PLAYLIST } from "../../mutation.js";
import client from "../../Config/hasura.js";
import { VERIFY_PLAYLIST_EMPTY } from "../../queries.js";

const router = Router();

router.post("/api/deletePlaylist", async (req, res) => {
  try {
    const { playlist_id } = req.body;
    const response = await client.request(VERIFY_PLAYLIST_EMPTY, {
      playlist_id,
    });
    if (response.playlist_songs.length === 0) {
      await client.request(DELETE_PLAYLIST, { playlist_id });
      return res.status(200).json("successfully deleted playlist");
    } else {
      return res.status(409).json("playlist has songs. so cannot delete");
    }
  } catch (error) {
    console.error("Error deleting playlist", error);
    res.status(500).json("Error deleting playlist");
  }
});

export default router;
