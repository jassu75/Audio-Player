import { createSlice } from "@reduxjs/toolkit";
import { readStoredJson, writeStoredJson } from "../../utils/storage";

const audioPlayer = readStoredJson(sessionStorage, "audioplayer");

const initialState = {
  viewingSongList: audioPlayer?.viewingSongList ?? audioPlayer?.viewingSonglist ?? null,
  playingSongList: audioPlayer?.playingSongList ?? audioPlayer?.playingSonglist ?? null,
  playingIndex: audioPlayer?.playingIndex ?? null,
};

const sync = (state) => {
  writeStoredJson(sessionStorage, "audioplayer", state);
};

const audioPlayerSlice = createSlice({
  name: "audioplayer",
  initialState,
  reducers: {
    setViewingSongList: (state, action) => {
      state.viewingSongList = action.payload;
      sync(state);
    },
    addViewingSong: (state, action) => {
      const { song_id } = action.payload;
      if (!state.viewingSongList) {
        state.viewingSongList = {};
      }
      state.viewingSongList[song_id] = action.payload;
      sync(state);
    },
    deleteViewingSong: (state, action) => {
      if (state.viewingSongList) delete state.viewingSongList[action.payload];
      sync(state);
    },
    deleteSong: (state, action) => {
      const songId = action.payload;
      if (state.viewingSongList) delete state.viewingSongList[songId];
      if (state.playingSongList) delete state.playingSongList[songId];
      if (state.playingIndex === songId) {
        state.playingIndex = Object.keys(state.playingSongList ?? {})[0] ?? null;
      }
      sync(state);
    },
    renameViewingSong: (state, action) => {
      const songId = action.payload.songId;
      const newTitle = action.payload.newTitle;
      if (state.viewingSongList?.[songId]) {
        state.viewingSongList[songId].title = newTitle;
      }
      if (state.playingSongList?.[songId]) {
        state.playingSongList[songId].title = newTitle;
      }
      sync(state);
    },
    setPlayingSongList: (state) => {
      state.playingSongList = { ...state.viewingSongList };
      sync(state);
    },
    setPlayingIndex: (state, action) => {
      state.playingIndex = action.payload;
      sync(state);
    },
    clearPlayingContext: (state) => {
      state.playingIndex = null;
      state.playingSongList = null;
      sync(state);
    },
    playNext: (state) => {
      if (state.playingSongList && Object.keys(state.playingSongList).length) {
        const keys = Object.keys(state.playingSongList);
        const currentPos = keys.indexOf(String(state.playingIndex));
        state.playingIndex = keys[(currentPos + 1) % keys.length];
        sync(state);
      }
    },
    playPrevious: (state) => {
      if (state.playingSongList && Object.keys(state.playingSongList).length) {
        const keys = Object.keys(state.playingSongList);
        const currentPos = keys.indexOf(String(state.playingIndex));
        state.playingIndex = keys[(currentPos - 1 + keys.length) % keys.length];
        sync(state);
      }
    },
  },
});

export const {
  setViewingSongList,
  addViewingSong,
  deleteViewingSong,
  deleteSong,
  renameViewingSong,
  setPlayingSongList,
  setPlayingIndex,
  clearPlayingContext,
  playNext,
  playPrevious,
} = audioPlayerSlice.actions;
export default audioPlayerSlice.reducer;
