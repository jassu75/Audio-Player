import { Router } from "express";
import { FETCH_ASSETS } from "../../queries.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/fetchassets", async (req, res) => {
  try {
    const { user_id } = req.body;
    const response = await client.request(FETCH_ASSETS, {
      user_id,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching assets", error);
    res.status(500).json("Error fetching assets");
  }
});

export default router;
