import { Router } from "express";
import { FETCH_FAVORITES } from "../../graphql/queries.js";
import client from "../../Config/hasura.js";
import { normalizeSong } from "../../services/listeningHistory.js";
const router = Router();
router.post("/api/fetchfavorites", async (req, res) => {
    try {
        const user_id = req.user.uid;
        const response = await client.request(FETCH_FAVORITES, {
            user_id,
        });
        res.status(200).json({ favorites: response.favorites.map(item => ({ song: item.song ? normalizeSong(item.song) : null })) });
    }
    catch (error) {
        console.error("Error fetching favorites", error);
        res.status(500).json("Error fetching favorites");
    }
});
export default router;
