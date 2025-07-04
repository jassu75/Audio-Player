import { Router } from "express";
import { UPDATE_RECENTLY_PLAYED } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/updaterecentlyplayed", async (req, res) => {
  try {
    const { data } = req.body;
    const response = await client.request(UPDATE_RECENTLY_PLAYED, {
      recently_played: data,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating recently played", error);
    res.status(500).json("Error updating recently played");
  }
});

export default router;
