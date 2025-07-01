import { Router } from "express";
import { FETCH_USER_SONGS_RANDOMLY } from "../../queries.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/fetchrandomsongs", async (req, res) => {
  try {
    const { user_id } = req.body;
    const response = await client.request(FETCH_USER_SONGS_RANDOMLY, {
      user_id,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching random songs", error);
    res.status(500).json("Error fetching random songs");
  }
});

export default router;
