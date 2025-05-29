import { Router } from "express";
import { ADD_SONG } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/addSong", async (req, res) => {
  try {
    const { uploadedSong } = req.body;
    const response = await client.request(ADD_SONG, { ...uploadedSong });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error uploading song", error);
    res.status(500).json("Error uploading song");
  }
});

export default router;
