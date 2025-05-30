import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import checkExistingUserRoute from "./routes/queryRoutes/checkExistingUser.js";
import getSongs from "./routes/queryRoutes/getSongs.js";
import getPlaylists from "./routes/queryRoutes/getPlaylists.js";

import addUser from "./routes/mutationRoutes/addUser.js";
import addSong from "./routes/mutationRoutes/addSong.js";
import addPlaylist from "./routes/mutationRoutes/addPlaylist.js";
import deletePlaylist from "./routes/mutationRoutes/deletePlaylist.js";
import updateHomepageSong from "./routes/mutationRoutes/updateHomepageSongs.js";
import updatePlaylistSong from "./routes/mutationRoutes/updatePlaylistSongs.js";
import updatePlaylistId from "./routes/mutationRoutes/updatePlaylistId.js";

import fetchTopSongs from "./routes/jamendoRoutes/fetchTopSongs.js";

const app = express();
dotenv.config();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildFilePath = path.join(__dirname, "build");
app.use(express.static(buildFilePath));

app.listen(process.env.PORT, () => {
  console.log("Server started successfully", process.env.PORT);
});

app.use(checkExistingUserRoute);
app.use(getSongs);
app.use(getPlaylists);

app.use(addUser);
app.use(addSong);
app.use(addPlaylist);
app.use(deletePlaylist);
app.use(updateHomepageSong);
app.use(updatePlaylistSong);
app.use(updatePlaylistId);

app.use(fetchTopSongs);

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(buildFilePath, "index.html"));
});
