import { Router } from "express";
import { DELETE_PLAYLIST_SONG, DELETE_SONG } from "../../mutation.js";
import client from "../../Config/hasura.js";
import deleteAssets from "../../Cloudinary/deleteAssets.js";

const router = Router();

router.post("/api/deletesong", async (req, res) => {
  try {
    const { playlist_id, song_id, assets } = req.body;
    await client.request(DELETE_SONG, { song_id: song_id });
    await client.request(DELETE_PLAYLIST_SONG, {
      song_id: song_id,
      playlist_id: playlist_id,
    });
    if (assets.length > 0) {
      await deleteAssets(assets);
    }

    res.status(200).json("Song deleted successfully");
  } catch (error) {
    console.error("Error deleting song", error);
    res.status(500).json("Error deleting song");
  }
});

export default router;
