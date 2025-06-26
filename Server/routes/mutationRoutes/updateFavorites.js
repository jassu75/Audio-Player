import { Router } from "express";
import { UPDATE_FAVORITES } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/updatefavorites", async (req, res) => {
  try {
    const { user_id, favorites } = req.body;
    const response = await client.request(UPDATE_FAVORITES, {
      user_id,
      favorites,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating favorites ", error);
    res.status(500).json("Error updating favorites ");
  }
});

export default router;
