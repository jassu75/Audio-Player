import { createSlice } from "@reduxjs/toolkit";
import { readStoredJson, writeStoredJson } from "../../utils/storage";

const EXPIRY = {
  user: 7 * 24 * 60 * 60 * 1000,
  playlistCollection: 30 * 24 * 60 * 60 * 1000,
};

const checkExpired = (key, defaultValue) => {
  const storedItem = readStoredJson(localStorage, key);
  if (!storedItem) return defaultValue;

  const { data, timestamp } = storedItem;
  if (Date.now() - timestamp < EXPIRY[key]) {
    return data;
  } else {
    return defaultValue;
  }
};

const setWithTimestamp = (key, data) => {
  writeStoredJson(localStorage, key, { data, timestamp: Date.now() });
};

const setInSessionStorage = (key, data) => {
  writeStoredJson(sessionStorage, key, data);
};

const getFromSessionStorage = (key) => {
  return readStoredJson(sessionStorage, key);
};

const initialState = {
  user: checkExpired("user", null),
  playlistCollection: getFromSessionStorage("playlistCollection"),
};

const homepageSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      setWithTimestamp("user", action.payload);
    },

    setPlaylistCollection: (state, action) => {
      state.playlistCollection = action.payload;
      setInSessionStorage("playlistCollection", action.payload);
    },

    addPlaylist: (state, action) => {
      const newPlaylist = action.payload;
      const collection = state.playlistCollection?.find(
        (c) => c.type === "user",
      );
      if (collection) {
        collection.collection.push(newPlaylist);
      }
      setInSessionStorage("playlistCollection", state.playlistCollection);
    },

    deletePlaylist: (state, action) => {
      const playlistId = action.payload;
      const collection = state.playlistCollection?.find(
        (c) => c.type === "user",
      );
      if (collection) {
        const index = collection.collection.findIndex(
          (p) => p.playlist_id === playlistId,
        );
        if (index !== -1) collection.collection.splice(index, 1);
      }
      setInSessionStorage("playlistCollection", state.playlistCollection);
    },

    renamePlaylist: (state, action) => {
      const { playlistId, newTitle } = action.payload;
      const collection = state.playlistCollection?.find((c) => c.type === "user");
      const playlist = collection?.collection.find(
        (p) => p.playlist_id === playlistId,
      );
      if (playlist) playlist.playlist_title = newTitle;
      setInSessionStorage("playlistCollection", state.playlistCollection);
    },
  },
});

export const {
  setUser,
  setPlaylistCollection,
  addPlaylist,
  deletePlaylist,
  renamePlaylist,
} = homepageSlice.actions;

export default homepageSlice.reducer;
