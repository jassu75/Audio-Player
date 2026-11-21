import { Router } from "express";
import { ADD_FAVORITE } from "../../graphql/mutations.js";
import client from "../../Config/hasura.js";
import { canAccessSong } from "../../services/listeningHistory.js";
const router = Router();
router.post("/api/addfavorite", async (req, res) => {
    try {
        const { favorite_id } = req.body;
        const user_id = req.user.uid;
        if (!await canAccessSong(client, user_id, favorite_id)) return res.status(403).json({ error: "Track is not available in your library" });
        const response = await client.request(ADD_FAVORITE, {
            user_id,
            favorite_id,
        });
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error adding favorites ", error);
        res.status(500).json("Error adding favorites ");
    }
});
export default router;
