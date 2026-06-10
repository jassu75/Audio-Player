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

const setInSessionStorage = (key, data) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

const getFromSessionStorage = (key) => {
  return JSON.parse(sessionStorage.getItem(key)) || null;
};

const initialState = {
  user: checkExpired("user", null),
  playlistCollection: getFromSessionStorage("playlistCollection"),
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
      setInSessionStorage("playlistCollection", action.payload);
    },

    addPlaylist: (state, action) => {
      const newPlaylist = action.payload;
      const collection = state.playlistCollection.find(
        (c) => c.type === "user",
      );
      if (collection) {
        collection.collection.push(newPlaylist);
      }
      setInSessionStorage("playlistCollection", state.playlistCollection);
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
      setInSessionStorage("playlistCollection", state.playlistCollection);
    },

    renamePlaylist: (state, action) => {
      const { collectionId, playlistId, newTitle } = action.payload;
      state.playlistCollection[collectionId][playlistId].playlist_title =
        newTitle;
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
} = songsSlice.actions;

export default songsSlice.reducer;
