import { Router } from "express";
import { DELETE_SONG } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/deletesong", async (req, res) => {
  try {
    const { id } = req.body;
    const response = await client.request(DELETE_SONG, { id });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting song", error);
    res.status(500).json("Error deleting song");
  }
});

export default router;
