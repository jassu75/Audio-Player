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
  addViewingSong,
  deleteViewingSong,
  renameViewingSong,
  setPlayingSonglist,
  setPlayingIndex,
  playNext,
  playPrevious,
} = audioplayerSlice.actions;
export default audioplayerSlice.reducer;
