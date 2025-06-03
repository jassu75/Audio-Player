import { Router } from "express";
import axios from "axios";

const router = Router();
router.get("/api/jamendo/fetchTopSongs", async (req, res) => {
  try {
    const url = "https://api.jamendo.com/v3.0/tracks";
    const params = {
      client_id: process.env.CLIENT_ID,
      format: "jsonpretty",
      order: "popularity_total",
      limit: 30,
    };

    const response = await axios.get(url, { params: params });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error  fetching top jamendo songs", error);
    res.status(500).json("Error fetching top jamendo songs");
  }
});

export default router;
