import { Router } from "express";
import { GET_PLAYLISTS } from "../../queries.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/getPlaylists", async (req, res) => {
  try {
    const { user_id } = req.body;

    const response = await client.request(GET_PLAYLISTS, { user_id });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching playlists", error);
    res.status(500).json("Error fetching playlists");
  }
});

export default router;
