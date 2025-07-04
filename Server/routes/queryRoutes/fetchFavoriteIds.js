import { Router } from "express";
import { FETCH_FAVORITE_IDS } from "../../queries.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/fetchfavoriteids", async (req, res) => {
  try {
    const { user_id } = req.body;
    const response = await client.request(FETCH_FAVORITE_IDS, {
      user_id,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching favorite ids", error);
    res.status(500).json("Error fetching favorite ids");
  }
});

export default router;
