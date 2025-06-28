import { Router } from "express";
import { FETCH_SEARCH_SONGS } from "../../queries.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/fetchsearchsongs", async (req, res) => {
  try {
    const { user_id, search_text } = req.body;
    const response = await client.request(FETCH_SEARCH_SONGS, {
      user_id,
      search_text,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching search songs", error);
    res.status(500).json("Error fetching search songs");
  }
});

export default router;
