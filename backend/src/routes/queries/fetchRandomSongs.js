import client from "../../Config/hasura.js";
import { createRandomSongsRouter } from "../../services/randomSongs.js";
const router = createRandomSongsRouter(client);
export default router;
