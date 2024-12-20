import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  songs: JSON.parse(localStorage.getItem("songsList")) || {},
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const songsSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    setSongs: (state, action) => {
      state.songs = action.payload;
      localStorage.setItem("songsList", JSON.stringify(state.songs));
    },
    addSongs: (state, action) => {
      const { title, ...songWithoutTitle } = action.payload;
      state.songs[title] = songWithoutTitle;
      localStorage.setItem("songsList", JSON.stringify(state.songs));
    },
    setHomepageSongTitles: (state, action) => {
      state.user.homepage_songs = action.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    addHomepageSongTitles: (state, action) => {
      state.user.homepage_songs.push(action.payload);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    removeSongs: (state, action) => {
      delete state.songs[action.payload];
      localStorage.setItem("songsList", JSON.stringify(state.songs));
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  setSongs,
  addSongs,
  removeSongs,
  setUser,
  setHomepageSongTitles,
  addHomepageSongTitles,
} = songsSlice.actions;
export default songsSlice.reducer;
