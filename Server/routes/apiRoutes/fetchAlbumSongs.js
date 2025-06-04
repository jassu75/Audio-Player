import { Router } from "express";
import axios from "axios";

const router = Router();
router.get("/api/audius/albumSongs/:playlistId", async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const audiusUrl = req.app.locals.audiusUrl;
    const url = `${audiusUrl}/v1/playlists/${playlistId}/tracks`;
    const params = {
      limit: 30,
    };

    const response = await axios.get(url, { params: params });
    const refinedResponse = {
      sourceUrl: audiusUrl,
      data: response.data.data,
    };
    res.status(200).json(refinedResponse);
  } catch (error) {
    console.error("Error  fetching audius album songs", error);
    res.status(500).json("Error fetching audius album songs");
  }
});

export default router;
