import { Router } from "express";
import { MOVE_SONG } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/moveSong", async (req, res) => {
  try {
    const { oldPlaylistId, newPlaylistId, songId } = req.body;
    const response = await client.request(MOVE_SONG, {
      old_playlist_id: oldPlaylistId,
      new_playlist_id: newPlaylistId,
      song_id: songId,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error moving song", error);
    res.status(500).json("Error moving song");
  }
});

export default router;
