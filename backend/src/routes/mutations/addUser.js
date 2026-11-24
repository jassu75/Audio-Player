import { Router } from "express";
import { ADD_USER } from "../../graphql/mutations.js";
import client from "../../Config/hasura.js";
import firebaseAuth from "../../Config/firebase.js";
const router = Router();
router.post("/api/addUser", async (req, res) => {
  try {
    const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
    if (!token)
      return res.status(401).json({ error: "Registration token required" });
    let claims;
    try {
      claims = await firebaseAuth.verifyIdToken(token, true);
    } catch {
      return res.status(401).json({ error: "Invalid registration token" });
    }
    const { newUser } = req.body;
    if (newUser?.user_id !== claims.uid || newUser?.email_id !== claims.email) {
      return res
        .status(403)
        .json({ error: "Registration does not match the signed-in user" });
    }
    const response = await client.request(ADD_USER, {
      ...newUser,
      user_id: claims.uid,
      email_id: claims.email,
      sign_in_method:
        claims.firebase.sign_in_provider === "google.com" ? "google" : "email",
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error adding user", error);
    res.status(500).json("Error adding user");
  }
});
export default router;
