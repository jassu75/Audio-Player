import { Router } from "express";
import { FETCH_RECENTLY_PLAYED } from "../../queries.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/fetchrecentlyplayed", async (req, res) => {
  try {
    const { user_id } = req.body;
    const response = await client.request(FETCH_RECENTLY_PLAYED, {
      user_id,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching recently played", error);
    res.status(500).json("Error fetching recently played");
  }
});

export default router;
