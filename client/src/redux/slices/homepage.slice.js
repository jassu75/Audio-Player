import { createSlice } from "@reduxjs/toolkit";

const Expiry = 7 * 24 * 60 * 60 * 1000;

const checkExpired = (key, defaultValue) => {
  const storedItem = localStorage.getItem(key);
  if (!storedItem) {
    return defaultValue;
  }
  const { data, timestamp } = JSON.parse(storedItem);
  if (Date.now() - timestamp < Expiry) {
    return data;
  } else {
    localStorage.removeItem(key);
    return defaultValue;
  }
};

const initialState = {
  songs: JSON.parse(localStorage.getItem("songsList")) || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  playlists: JSON.parse(localStorage.getItem("playlists")) || null,
  jamendoSongs: checkExpired("jamendoSongs", null),
  audiusAlbums: checkExpired("audiusAlbums", null),
  audiusSongs: null,
};

const songsSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    setSongs: (state, action) => {
      state.songs = action.payload;
      localStorage.setItem("songsList", JSON.stringify(action.payload));
    },
    addSongs: (state, action) => {
      const { song_id, ...songWithoutId } = action.payload;
      if (!state.songs) {
        state.songs = {};
      }
      state.songs[song_id] = songWithoutId;
      localStorage.setItem("songsList", JSON.stringify(state.songs));
    },
    deleteSong: (state, action) => {
      delete state.songs[action.payload];
      localStorage.setItem("songsList", JSON.stringify(state.songs));
    },

    setPlaylistDetails: (state, action) => {
      state.playlists = action.payload;
      localStorage.setItem("playlists", JSON.stringify(action.payload));
    },
    addPlaylistDetails: (state, action) => {
      const { id, ...playlistWithoutId } = action.payload;
      if (!state.playlists) {
        state.playlists = {};
      }
      state.playlists[id] = playlistWithoutId;
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    deletePlaylistDetails: (state, action) => {
      delete state.playlists[action.payload];
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },

    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    setJamendoSongs: (state, action) => {
      state.jamendoSongs = action.payload;
      const data = {
        data: action.payload,
        timestamp: Date.now(),
      };
      localStorage.setItem("jamendoSongs", JSON.stringify(data));
    },

    setAudiusAlbums: (state, action) => {
      state.audiusAlbums = action.payload;
      const data = {
        data: action.payload,
        timestamp: Date.now(),
      };
      localStorage.setItem("audiusAlbums", JSON.stringify(data));
    },
    setAudiusSongs: (state, action) => {
      state.audiusSongs = action.payload;
    },

    renameSong: (state, action) => {
      const songId = action.payload.songId;
      const newTitle = action.payload.newTitle;
      state.songs[songId].title = newTitle;
      localStorage.setItem("songsList", JSON.stringify(state.songs));
    },
    renamePlaylist: (state, action) => {
      const playlistId = action.payload.playlistId;
      const newTitle = action.payload.newTitle;
      state.playlists[playlistId].playlist_title = newTitle;
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
  },
});

export const {
  setSongs,
  addSongs,
  removeHomepageSong,
  setUser,
  addPlaylistDetails,
  setPlaylistDetails,
  deletePlaylistDetails,
  deleteSong,
  setJamendoSongs,
  setAudiusSongs,
  setAudiusAlbums,
  renameSong,
  renamePlaylist,
} = songsSlice.actions;

export default songsSlice.reducer;
