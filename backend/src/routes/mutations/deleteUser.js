import { Router } from "express";
import { DELETE_USER } from "../../graphql/mutations.js";
import client from "../../Config/hasura.js";
import firebaseAuthenticate from "../../MiddleWare/firebaseAuthenticate.js";
import firebaseAuth from "../../Config/firebase.js";
import deleteAssets from "../../services/cloudinary/deleteAssets.js";
const router = Router();
router.post("/api/deleteuser", firebaseAuthenticate, async (req, res) => {
    try {
        const user_id = req.user.uid;
        const { assets } = req.body;
        if (assets.length > 0) {
            await deleteAssets(assets);
        }
        await client.request(DELETE_USER, { user_id: user_id });
        await firebaseAuth.deleteUser(user_id);
        res.status(200).json("User Deleted Successfully");
    }
    catch (error) {
        console.error("Error deleting user", error);
        res.status(500).json("Error deleting user");
    }
});
export default router;
