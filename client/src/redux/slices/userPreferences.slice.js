import { createSlice } from "@reduxjs/toolkit";

const userPrefs = JSON.parse(localStorage.getItem("userPrefs"));

const initialState = {
  recentlyPlayed: userPrefs?.recentlyPlayed || null,
  favorites: userPrefs?.favorites || null,
};

const userPrefsSlice = createSlice({
  name: "userPrefs",
  initialState,
  reducers: {
    setRecentlyPlayed: (state, action) => {
      state.recentlyPlayed = action.payload;
      localStorage.setItem("userPrefs", JSON.stringify(state));
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
      localStorage.setItem("userPrefs", JSON.stringify(state));
    },
    setFavorite: (state, action) => {
      state.favorites = action.payload;
      localStorage.setItem("userPrefs", JSON.stringify(state));
    },
    addFavorite: (state, action) => {
      if (!state.favorites) state.favorites = [];
      state.favorites.push(action.payload);
      localStorage.setItem("userPrefs", JSON.stringify(state));
    },
    deleteFavorite: (state, action) => {
      if (!state.favorites) state.favorites = [];
      state.favorites = state.favorites.filter(
        (songId) => songId !== action.payload
      );
      localStorage.setItem("userPrefs", JSON.stringify(state));
    },
  },
});

export const {
  setRecentlyPlayed,
  addRecentlyPlayed,
  addFavorite,
  deleteFavorite,
  setFavorite,
} = userPrefsSlice.actions;
export default userPrefsSlice.reducer;
