import { Router } from "express";
import { UPDATE_PLAYLIST_IDS } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/updatePlaylistId", async (req, res) => {
  try {
    const { user_id, playlist_ids } = req.body;
    const response = await client.request(UPDATE_PLAYLIST_IDS, {
      id: user_id,
      playlist_ids,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating playlist id", error);
    res.status(500).json("Error updating playlist id");
  }
});

export default router;
