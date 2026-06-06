import { Router } from "express";
import { FETCH_SYSTEM_PLAYLISTS } from "../../queries.js";
import client from "../../Config/hasura.js";
import firebaseAuthenticate from "../../MiddleWare/firebaseAuthenticate.js";

const router = Router();

router.get(
  "/api/fetch-system-playlists",
  firebaseAuthenticate,
  async (req, res) => {
    try {
      const response = await client.request(FETCH_SYSTEM_PLAYLISTS);

      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching system playlists", error);
      res.status(500).json("Error fetching  system playlists");
    }
  },
);

export default router;
