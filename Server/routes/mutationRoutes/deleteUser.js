import { Router } from "express";
import { DELETE_USER } from "../../mutation.js";
import client from "../../Config/hasura.js";
import firebaseAuthenticate from "../../MiddleWare/firebaseAuthenticate.js";
import admin from "../../Config/firebase.js";

const router = Router();

router.post("/api/deleteuser", firebaseAuthenticate, async (req, res) => {
  try {
    const email = req.user.email;
    const uid = req.user.uid;
    await client.request(DELETE_USER, { email });
    await admin.auth().deleteUser(uid);

    res.status(200).json("User Deleted Successfully");
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).json("Error deleting user");
  }
});

export default router;
