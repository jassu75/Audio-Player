import { Router } from "express";
import { CHECK_EXISTING_USER } from "../../queries.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/checkExistingUser", async (req, res) => {
  try {
    const { email } = req.body;
    const response = await client.request(CHECK_EXISTING_USER, { email });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error checking existing user", error);
    res.status(500).json("Error checking existing user");
  }
});

export default router;
