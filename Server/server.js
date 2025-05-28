import express from "express";
import dotenv from "dotenv";
import checkExistingUserRoute from "./routes/queryRoutes/checkExistingUser.js";
import getSongs from "./routes/queryRoutes/getSongs.js";
import getPlaylists from "./routes/queryRoutes/getPlaylists.js";

const app = express();
dotenv.config();
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("Server started successfully", process.env.PORT);
});

app.use(checkExistingUserRoute);
app.use(getSongs);
app.use(getPlaylists);
