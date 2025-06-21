import { Router } from "express";
import { VERIFY_EMAIL } from "../../queries.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/verifyemail", async (req, res) => {
  try {
    const { email_id } = req.body;
    const response = await client.request(VERIFY_EMAIL, { email_id });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error verifying user email", error);
    res.status(500).json("Error verifying user email");
  }
});

export default router;
