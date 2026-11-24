import { Router } from "express";
import { FETCH_PLAYLIST_SONGS } from "../../graphql/queries.js";
import client from "../../Config/hasura.js";
import { normalizeSong } from "../../services/listeningHistory.js";
const router = Router();
router.post("/api/fetchPlaylistSongs", async (req, res) => {
  try {
    const { playlist_id } = req.body;
    const response = await client.request(FETCH_PLAYLIST_SONGS, {
      playlist_id,
      user_id: req.user.uid,
    });
    res
      .status(200)
      .json({
        playlists: response.playlists.map((item) => ({
          songs: item.songs ? normalizeSong(item.songs) : null,
        })),
      });
  } catch (error) {
    console.error("Error fetching songs", error);
    res.status(500).json("Error fetching songs");
  }
});
export default router;
