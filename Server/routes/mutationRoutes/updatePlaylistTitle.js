import { Router } from "express";
import { UPDATE_PLAYLIST_TITLE } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/updateplaylisttitle", async (req, res) => {
  try {
    const { playlistId, newTitle } = req.body;
    const response = await client.request(UPDATE_PLAYLIST_TITLE, {
      playlist_id: playlistId,
      playlist_title: newTitle,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating playlist title", error);
    res.status(500).json("Error updating playlist title");
  }
});

export default router;
