import { Router } from "express";
import axios from "axios";
import { getAudiusUrl } from "../../services/audius.js";
const router = Router();
router.get("/api/audius/fetchTopAlbums", async (req, res) => {
    try {
        const audiusUrl = await getAudiusUrl(req.app);
        const url = `${audiusUrl}/v1/playlists/trending`;
        const params = {
            time: "allTime",
        };
        const response = await axios.get(url, { params: params });
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Error  fetching top audius albums", error);
        res.status(503).json("Error fetching top audius albums");
    }
});
export default router;
