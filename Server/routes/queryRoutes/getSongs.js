import { Router } from "express";
import { GET_SONGS } from "../../queries.js";
import client from "../../Config/hasura.js";

const router = Router();

router.get("/api/getSongs", async (req, res) => {
  try {
    const response = await client.request(GET_SONGS);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching songs", error);
    res.status(500).json("Error fetching songs");
  }
});

export default router;
