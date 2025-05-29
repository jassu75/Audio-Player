import { Router } from "express";
import { ADD_PLAYLIST } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/addPlaylist", async (req, res) => {
  try {
    const { uploadPlaylist } = req.body;
    const response = await client.request(ADD_PLAYLIST, { ...uploadPlaylist });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error uploading playlist", error);
    res.status(500).json("Error uploading playlist");
  }
});

export default router;
