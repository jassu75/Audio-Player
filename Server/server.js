import "./Config/config.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

import checkExistingUser from "./routes/queryRoutes/checkExistingUser.js";
import fetchPlaylistSongs from "./routes/queryRoutes/fetchPlaylistSongs.js";
import getPlaylists from "./routes/queryRoutes/getPlaylists.js";
import verifyUser from "./routes/queryRoutes/verifyEmail.js";

import addUser from "./routes/mutationRoutes/addUser.js";
import addSong from "./routes/mutationRoutes/addSong.js";
import addPlaylist from "./routes/mutationRoutes/addPlaylist.js";
import addPlaylistSong from "./routes/mutationRoutes/addPlaylistSongs.js";
import addFavorite from "./routes/mutationRoutes/addFavorite.js";

import deletePlaylist from "./routes/mutationRoutes/deletePlaylist.js";
import deleteUser from "./routes/mutationRoutes/deleteUser.js";
import deleteSong from "./routes/mutationRoutes/deleteSong.js";
import deleteFavorite from "./routes/mutationRoutes/deleteFavorite.js";

import updateSongTitle from "./routes/mutationRoutes/updateSongTitle.js";
import updatePlaylistTitle from "./routes/mutationRoutes/updatePlaylistTitle.js";
import updateRecentlyPlayed from "./routes/mutationRoutes/updateRecentlyPlayed.js";

import fetchTopSongs from "./routes/apiRoutes/fetchTopSongs.js";
import fetchTopAlbums from "./routes/apiRoutes/fetchTopAlbums.js";
import fetchAlbumSongs from "./routes/apiRoutes/fetchAlbumSongs.js";
import fetchSearchSongs from "./routes/queryRoutes/fetchSearchSongs.js";
import fetchRecentlyPlayed from "./routes/queryRoutes/fetchRecentlyPlayed.js";
import fetchFavorites from "./routes/queryRoutes/fetchFavorites.js";
import fetchAssets from "./routes/queryRoutes/fetchAssets.js";
import fetchRandomSongs from "./routes/queryRoutes/fetchRandomSongs.js";

import uploadCloudinaryImage from "./Cloudinary/uploadImage.js";
import uploadCloudinaryAudio from "./Cloudinary/uploadAudio.js";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildFilePath = path.join(__dirname, "build");
app.use(express.static(buildFilePath));

app.use(checkExistingUser);
app.use(fetchPlaylistSongs);
app.use(getPlaylists);
app.use(verifyUser);

app.use(addUser);
app.use(addSong);
app.use(addPlaylist);
app.use(addPlaylistSong);
app.use(addFavorite);

app.use(deletePlaylist);
app.use(deleteUser);
app.use(deleteSong);
app.use(deleteFavorite);

app.use(updateSongTitle);
app.use(updatePlaylistTitle);
app.use(updateRecentlyPlayed);

app.use(fetchTopSongs);
app.use(fetchTopAlbums);
app.use(fetchAlbumSongs);
app.use(fetchSearchSongs);
app.use(fetchRecentlyPlayed);
app.use(fetchFavorites);
app.use(fetchAssets);
app.use(fetchRandomSongs);

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
