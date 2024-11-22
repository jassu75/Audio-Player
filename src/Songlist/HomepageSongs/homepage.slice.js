import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  songs: {},
};

const songsSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    setSongs: (state, action) => {
      state.songs = action.payload;
    },
    addSong: (state, action) => {
      const newId = Object.keys(state.songs).length;
      state.songs[newId] = action.payload;
    },
  },
});

export const { setSongs, addSong } = songsSlice.actions;
export default songsSlice.reducer;
