import { Router } from "express";
import { DELETE_FAVORITE } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/deletefavorite", async (req, res) => {
  try {
    const { user_id, favorite_id } = req.body;
    const response = await client.request(DELETE_FAVORITE, {
      user_id,
      favorite_id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting favorites ", error);
    res.status(500).json("Error deleting favorites ");
  }
});

export default router;
