import "./Config/config.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

import checkExistingUser from "./routes/queryRoutes/checkExistingUser.js";
import getSongs from "./routes/queryRoutes/getSongs.js";
import getPlaylists from "./routes/queryRoutes/getPlaylists.js";
import verifyUser from "./routes/queryRoutes/verifyEmail.js";

import addUser from "./routes/mutationRoutes/addUser.js";
import addSong from "./routes/mutationRoutes/addSong.js";
import addPlaylist from "./routes/mutationRoutes/addPlaylist.js";

import deletePlaylist from "./routes/mutationRoutes/deletePlaylist.js";
import deleteUser from "./routes/mutationRoutes/deleteUser.js";
import deleteSong from "./routes/mutationRoutes/deleteSong.js";

import updateHomepageSong from "./routes/mutationRoutes/updateHomepageSongs.js";
import updatePlaylistSong from "./routes/mutationRoutes/updatePlaylistSongs.js";
import updatePlaylistId from "./routes/mutationRoutes/updatePlaylistId.js";
import updateSongTitle from "./routes/mutationRoutes/updateSongTitle.js";
import updatePlaylistTitle from "./routes/mutationRoutes/updatePlaylistTitle.js";
import updateRecentlyPlayed from "./routes/mutationRoutes/updateRecentlyPlayed.js";

import fetchTopSongs from "./routes/apiRoutes/fetchTopSongs.js";
import fetchTopAlbums from "./routes/apiRoutes/fetchTopAlbums.js";
import fetchAlbumSongs from "./routes/apiRoutes/fetchAlbumSongs.js";

import uploadCloudinaryImage from "./Cloudinary/uploadImage.js";
import uploadCloudinaryAudio from "./Cloudinary/uploadAudio.js";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildFilePath = path.join(__dirname, "build");
app.use(express.static(buildFilePath));

app.use(checkExistingUser);
app.use(getSongs);
app.use(getPlaylists);
app.use(verifyUser);

app.use(addUser);
app.use(addSong);
app.use(addPlaylist);

app.use(deletePlaylist);
app.use(deleteUser);
app.use(deleteSong);

app.use(updateHomepageSong);
app.use(updatePlaylistSong);
app.use(updatePlaylistId);
app.use(updateSongTitle);
app.use(updatePlaylistTitle);
app.use(updateRecentlyPlayed);

app.use(fetchTopSongs);
app.use(fetchTopAlbums);
app.use(fetchAlbumSongs);

app.use(uploadCloudinaryImage);
app.use(uploadCloudinaryAudio);

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(buildFilePath, "index.html"));
});

const startServer = async () => {
  const response = await axios.get("https://api.audius.co");
  app.locals.audiusUrl = response.data.data[0];
  app.listen(process.env.PORT, () => {
    console.log("Server started successfully", app.locals.audiusUrl);
  });
};

startServer();
