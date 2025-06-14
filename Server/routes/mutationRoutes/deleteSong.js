import { Router } from "express";
import { DELETE_SONG } from "../../mutation.js";
import client from "../../Config/hasura.js";
import deleteAssets from "../../Cloudinary/deleteAssets.js";

const router = Router();

router.post("/api/deletesong", async (req, res) => {
  try {
    const { songIds, assets } = req.body;
    const response = await client.request(DELETE_SONG, { ids: songIds });
    if (assets.length > 0) {
      await deleteAssets(assets);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting song", error);
    res.status(500).json("Error deleting song");
  }
});

export default router;
