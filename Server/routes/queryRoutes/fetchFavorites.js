import { Router } from "express";
import { FETCH_FAVORITES } from "../../queries.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/fetchfavorites", async (req, res) => {
  try {
    const { user_id } = req.body;
    const response = await client.request(FETCH_FAVORITES, {
      user_id,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching favorites", error);
    res.status(500).json("Error fetching favorites");
  }
});

export default router;
