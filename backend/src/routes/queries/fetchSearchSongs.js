import { Router } from "express";
import { FETCH_SEARCH_SONGS } from "../../graphql/queries.js";
import client from "../../Config/hasura.js";
import { normalizeSong } from "../../services/listeningHistory.js";
const router = Router();
router.post("/api/fetchsearchsongs", async (req, res) => {
  try {
    const { search_text } = req.body;
    const user_id = req.user.uid;
    const response = await client.request(FETCH_SEARCH_SONGS, {
      user_id,
      search_text,
    });
    res
      .status(200)
      .json({ searchResults: response.searchResults.map(normalizeSong) });
  } catch (error) {
    console.error("Error fetching search songs", error);
    res.status(500).json("Error fetching search songs");
  }
});
export default router;
