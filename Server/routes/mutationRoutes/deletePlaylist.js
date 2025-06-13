import { Router } from "express";
import { DELETE_PLAYLIST } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/deletePlaylist", async (req, res) => {
  try {
    const { ids } = req.body;
    const response = await client.request(DELETE_PLAYLIST, { ids });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting playlist", error);
    res.status(500).json("Error deleting playlist");
  }
});

export default router;
