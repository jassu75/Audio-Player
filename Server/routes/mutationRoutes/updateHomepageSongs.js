import { Router } from "express";
import { UPDATE_HOMEPAGE_SONGS } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/updateHomepageSong", async (req, res) => {
  try {
    const { user_id, homepage_songs } = req.body;
    const response = await client.request(UPDATE_HOMEPAGE_SONGS, {
      user_id,
      homepage_songs,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating homepage songs", error);
    res.status(500).json("Error updating homepage songs");
  }
});

export default router;
