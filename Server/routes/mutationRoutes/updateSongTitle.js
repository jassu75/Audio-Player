import { Router } from "express";
import { UPDATE_SONG_TITLE } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/updatesongtitle", async (req, res) => {
  try {
    const { songId, newTitle } = req.body;
    const response = await client.request(UPDATE_SONG_TITLE, {
      song_id: songId,
      title: newTitle,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating song title", error);
    res.status(500).json("Error updating song title");
  }
});

export default router;
