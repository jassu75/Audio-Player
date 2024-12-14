import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  songs: {},
  user: null,
};

const songsSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    setSongs: (state, action) => {
      state.songs = action.payload;
    },
    addSongs: (state, action) => {
      const { id, ...songWithoutId } = action.payload;
      state.songs[id] = songWithoutId;
      localStorage.setItem("songsList", JSON.stringify(state.songs));
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

export const { setSongs, addSongs, removeSongs, setUser } = songsSlice.actions;
export default songsSlice.reducer;
