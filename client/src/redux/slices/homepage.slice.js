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

    updatePlaylistCollection: (state, action) => {
      const { collectionId, playlistId, data } = action.payload;
      state.playlistCollection[collectionId][playlistId] = {
        ...state.playlistCollection[collectionId][playlistId],
        ...data,
      };
      setWithTimestamp("playlistCollection", state.playlistCollection);
    },

    deleteFromPlaylistCollection: (state, action) => {
      const { collectionId, playlistId } = action.payload;
      delete state.playlistCollection[collectionId][playlistId];
      setWithTimestamp("playlistCollection", state.playlistCollection);
    },

    renameInPlaylistCollection: (state, action) => {
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
  updatePlaylistCollection,
  deleteFromPlaylistCollection,
  renameInPlaylistCollection,
} = songsSlice.actions;

export default songsSlice.reducer;
