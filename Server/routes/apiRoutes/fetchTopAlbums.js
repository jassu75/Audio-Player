import { Router } from "express";
import axios from "axios";

const router = Router();
router.get("/api/audius/fetchTopAlbums", async (req, res) => {
  try {
    const audiusUrl = req.app.locals.audiusUrl;
    const url = `${audiusUrl}/v1/playlists/trending`;
    const params = {
      time: "allTime",
      limit: 30,
    };

    const response = await axios.get(url, { params: params });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error  fetching top audius albums", error);
    res.status(500).json("Error fetching top audius albums");
  }
});

export default router;
