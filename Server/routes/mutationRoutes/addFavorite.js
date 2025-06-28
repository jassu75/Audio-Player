import { Router } from "express";
import { ADD_FAVORITE } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/addfavorite", async (req, res) => {
  try {
    const { user_id, favorite_id } = req.body;
    const response = await client.request(ADD_FAVORITE, {
      user_id,
      favorite_id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error adding favorites ", error);
    res.status(500).json("Error adding favorites ");
  }
});

export default router;
