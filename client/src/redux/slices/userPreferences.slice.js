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
      state.recentlyPlayed = state.recentlyPlayed.filter(
        (id) => id !== action.payload
      );
      state.recentlyPlayed.unshift(action.payload);
      if (state.recentlyPlayed.length > 5) {
        state.recentlyPlayed.pop();
      }
      localStorage.setItem("userPrefs", JSON.stringify(state));
    },
    setFavorite: (state, action) => {
      state.favorites = action.payload;
      localStorage.setItem("userPrefs", JSON.stringify(state));
    },
  },
});

export const { setRecentlyPlayed, addRecentlyPlayed, setFavorite } =
  userPrefsSlice.actions;
export default userPrefsSlice.reducer;
