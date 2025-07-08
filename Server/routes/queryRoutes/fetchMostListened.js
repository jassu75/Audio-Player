import { Router } from "express";
import { FETCH_MOST_LISTENED } from "../../queries.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/fetchMostListened", async (req, res) => {
  try {
    const { user_id } = req.body;
    const response = await client.request(FETCH_MOST_LISTENED, {
      user_id,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching most listened", error);
    res.status(500).json("Error fetching most listened");
  }
});

export default router;
