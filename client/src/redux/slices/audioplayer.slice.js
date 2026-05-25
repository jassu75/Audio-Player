import { createSlice } from "@reduxjs/toolkit";

const audioplayer = JSON.parse(sessionStorage.getItem("audioplayer"));

const initialState = {
  viewingSonglist: audioplayer?.viewingSonglist || null,
  playingSonglist: audioplayer?.playingSonglist || null,
  playingIndex: audioplayer?.playingIndex || 0,
};

const sync = (state) => {
  sessionStorage.setItem("audioplayer", JSON.stringify(state));
};

const audioplayerSlice = createSlice({
  name: "audioplayer",
  initialState,
  reducers: {
    setViewingSonglist: (state, action) => {
      state.viewingSonglist = action.payload;
      sync(state);
    },
    setPlayingSonglist: (state, action) => {
      state.playingSonglist = action.payload;
      sync(state);
    },
    playNext: (state) => {
      if (state.playingSonglist) {
        state.playingIndex =
          (state.playingIndex + 1) % state.playingSonglist.length;
        sync(state);
      }
    },
    playPrevious: (state) => {
      if (state.playingSonglist) {
        state.playingIndex =
          (state.playingIndex - 1 + state.playingSonglist.length) %
          state.playingSonglist.length;
        sync(state);
      }
    },
  },
});

export const {
  setViewingSonglist,
  setPlayingSonglist,
  playNext,
  playPrevious,
} = audioplayerSlice.actions;
export default audioplayerSlice.reducer;
