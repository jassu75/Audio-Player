import { Router } from "express";
import { ADD_USER } from "../../mutation.js";
import client from "../../Config/hasura.js";

const router = Router();

router.post("/api/addUser", async (req, res) => {
  try {
    const { newUser } = req.body;
    const response = await client.request(ADD_USER, { ...newUser });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error adding user", error);
    res.status(500).json("Error adding user");
  }
});

export default router;
