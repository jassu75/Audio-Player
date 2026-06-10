import { createSlice } from "@reduxjs/toolkit";

const EXPIRY = {
  user: 7 * 24 * 60 * 60 * 1000,
  playlistCollection: 30 * 24 * 60 * 60 * 1000,
};

const checkExpired = (key, defaultValue) => {
  const storedItem = localStorage.getItem(key);
  if (!storedItem) return defaultValue;

  const { data, timestamp } = JSON.parse(storedItem);
  if (Date.now() - timestamp < EXPIRY[key]) {
    return data;
  } else {
    localStorage.removeItem(key);
    return defaultValue;
  }
};

const setWithTimestamp = (key, data) => {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};

const initialState = {
  user: checkExpired("user", null),
  playlistCollection: checkExpired("playlistCollection", null),
};

const songsSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      setWithTimestamp("user", action.payload);
    },

    setPlaylistCollection: (state, action) => {
      state.playlistCollection = action.payload;
      setWithTimestamp("playlistCollection", state.playlistCollection);
    },

    addPlaylist: (state, action) => {
      const newPlaylist = action.payload;
      const collection = state.playlistCollection.find(
        (c) => c.type === "user",
      );
      if (collection) {
        collection.collection.push(newPlaylist);
      }

      setWithTimestamp("playlistCollection", state.playlistCollection);
    },

    deletePlaylist: (state, action) => {
      const playlistId = action.payload;
      const collection = state.playlistCollection.find(
        (c) => c.type === "user",
      );
      if (collection) {
        const index = collection.collection.findIndex(
          (p) => p.playlist_id === playlistId,
        );
        if (index !== -1) collection.collection.splice(index, 1);
      }
      setWithTimestamp("playlistCollection", state.playlistCollection);
    },

    renamePlaylist: (state, action) => {
      const { collectionId, playlistId, newTitle } = action.payload;
      state.playlistCollection[collectionId][playlistId].playlist_title =
        newTitle;
      setWithTimestamp("playlistCollection", state.playlistCollection);
    },
  },
});

export const {
  setUser,
  setPlaylistCollection,
  addPlaylist,
  deletePlaylist,
  renamePlaylist,
} = songsSlice.actions;

export default songsSlice.reducer;
