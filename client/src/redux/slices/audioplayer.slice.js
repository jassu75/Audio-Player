import { createSlice } from "@reduxjs/toolkit";

const audioplayer = JSON.parse(sessionStorage.getItem("audioplayer"));

const initialState = {
  viewingSonglist: audioplayer?.viewingSonglist || null,
  playingSonglist: audioplayer?.playingSonglist || null,
  playingIndex: audioplayer?.playingIndex || null,
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
    addViewingSong: (state, action) => {
      const { song_id } = action.payload;
      if (!state.viewingSonglist) {
        state.viewingSonglist = {};
      }
      state.viewingSonglist[song_id] = action.payload;
      sync(state);
    },
    deleteViewingSong: (state, action) => {
      delete state.viewingSonglist[action.payload];
      sync(state);
    },
    renameViewingSong: (state, action) => {
      const songId = action.payload.songId;
      const newTitle = action.payload.newTitle;
      state.viewingSonglist[songId].title = newTitle;
      sync(state);
    },
    setPlayingSonglist: (state) => {
      state.playingSonglist = { ...state.viewingSonglist };
      sync(state);
    },
    setPlayingIndex: (state, action) => {
      state.playingIndex = action.payload;
      sync(state);
    },
    clearPlayingContext: (state) => {
      state.playingIndex = null;
      state.playingSonglist = null;
      sync(state);
    },
    playNext: (state) => {
      if (state.playingSonglist) {
        const keys = Object.keys(state.playingSonglist);
        const currentPos = keys.indexOf(String(state.playingIndex));
        state.playingIndex = keys[(currentPos + 1) % keys.length];
        sync(state);
      }
    },
    playPrevious: (state) => {
      if (state.playingSonglist) {
        const keys = Object.keys(state.playingSonglist);
        const currentPos = keys.indexOf(String(state.playingIndex));
        state.playingIndex = keys[(currentPos - 1 + keys.length) % keys.length];
        sync(state);
      }
    },
  },
});

export const {
  setViewingSonglist,
  addViewingSong,
  deleteViewingSong,
  renameViewingSong,
  setPlayingSonglist,
  setPlayingIndex,
  clearPlayingContext,
  playNext,
  playPrevious,
} = audioplayerSlice.actions;
export default audioplayerSlice.reducer;
