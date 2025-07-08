import { createSlice } from "@reduxjs/toolkit";

const userPrefs = JSON.parse(sessionStorage.getItem("userPrefs"));

const initialState = {
  listens: userPrefs?.listens || null,
  recentlyPlayed: userPrefs?.recentlyPlayed || null,
  favorites: userPrefs?.favorites || null,
};

const userPrefsSlice = createSlice({
  name: "userPrefs",
  initialState,
  reducers: {
    setRecentlyPlayed: (state, action) => {
      state.recentlyPlayed = action.payload;
      sessionStorage.setItem("userPrefs", JSON.stringify(state));
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
      sessionStorage.setItem("userPrefs", JSON.stringify(state));
    },
    setListens: (state, action) => {
      state.listens = action.payload;
      sessionStorage.setItem("userPrefs", JSON.stringify(state));
    },
    addListens: (state, action) => {
      if (!state.listens) state.listens = {};
      const songId = action.payload;
      state.listens[songId] = (state.listens[songId] || 0) + 1;
      sessionStorage.setItem("userPrefs", JSON.stringify(state));
    },
    setFavorite: (state, action) => {
      state.favorites = action.payload;
      sessionStorage.setItem("userPrefs", JSON.stringify(state));
    },
    addFavorite: (state, action) => {
      if (!state.favorites) state.favorites = [];
      state.favorites.push(action.payload);
      sessionStorage.setItem("userPrefs", JSON.stringify(state));
    },
    deleteFavorite: (state, action) => {
      if (!state.favorites) state.favorites = [];
      state.favorites = state.favorites.filter(
        (songId) => songId !== action.payload
      );
      sessionStorage.setItem("userPrefs", JSON.stringify(state));
    },
  },
});

export const {
  setRecentlyPlayed,
  addRecentlyPlayed,
  addFavorite,
  deleteFavorite,
  setFavorite,
  addListens,
  setListens,
} = userPrefsSlice.actions;
export default userPrefsSlice.reducer;
