import { createSlice } from "@reduxjs/toolkit";
import { readStoredJson, writeStoredJson } from "../../utils/storage";
import { normalizeRecentlyPlayed } from "../../utils/songs";

const userPrefs = readStoredJson(sessionStorage, "userPrefs");

const initialState = {
  listens: userPrefs?.listens || null,
  recentlyPlayed: normalizeRecentlyPlayed(userPrefs?.recentlyPlayed),
  favorites: userPrefs?.favorites || null,
};

const userPrefsSlice = createSlice({
  name: "userPrefs",
  initialState,
  reducers: {
    setRecentlyPlayed: (state, action) => {
      state.recentlyPlayed = normalizeRecentlyPlayed(action.payload);
      writeStoredJson(sessionStorage, "userPrefs", state);
    },
    addRecentlyPlayed: (state, action) => {
      if (!state.recentlyPlayed) state.recentlyPlayed = [];
      const newSong = {
        ...action.payload,
        last_played: new Date().toISOString(),
      };
      state.recentlyPlayed = state.recentlyPlayed.filter(
        (song) => song.song_id !== newSong.song_id
      );
      state.recentlyPlayed.unshift(newSong);
      if (state.recentlyPlayed.length > 50) {
        state.recentlyPlayed.pop();
      }
      writeStoredJson(sessionStorage, "userPrefs", state);
    },
    setListens: (state, action) => {
      state.listens = action.payload;
      writeStoredJson(sessionStorage, "userPrefs", state);
    },
    addListens: (state, action) => {
      if (!state.listens) state.listens = {};
      const songId = action.payload;
      state.listens[songId] = (state.listens[songId] || 0) + 1;
      writeStoredJson(sessionStorage, "userPrefs", state);
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
      writeStoredJson(sessionStorage, "userPrefs", state);
    },
    addFavorite: (state, action) => {
      if (!state.favorites) state.favorites = [];
      if (!state.favorites.includes(action.payload)) state.favorites.push(action.payload);
      writeStoredJson(sessionStorage, "userPrefs", state);
    },
    deleteFavorite: (state, action) => {
      if (!state.favorites) state.favorites = [];
      state.favorites = state.favorites.filter(
        (songId) => songId !== action.payload
      );
      writeStoredJson(sessionStorage, "userPrefs", state);
    },
  },
});

export const {
  setRecentlyPlayed,
  addRecentlyPlayed,
  addFavorite,
  deleteFavorite,
  setFavorites,
  addListens,
  setListens,
} = userPrefsSlice.actions;
export default userPrefsSlice.reducer;
