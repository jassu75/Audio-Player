import type {
  StoredAudioPlayerState,
  RenameSongPayload,
} from "./types/audioPlayerSlice.types";
import type {
  RefreshSearchQueuePayload,
  StartSearchPlaybackPayload,
} from "./types/audioPlayerSlice.types";
import { indexSongs } from "../../utils/songs";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { AudioPlayerState } from "./types/audioPlayerSlice.types";
import type {
  Song,
  SongMap,
} from "../../components/playlist/playlist-songs-list/playlist-song/types/song.types";
import { readStoredJson, writeStoredJson } from "../../utils/storage";
const audioPlayer = readStoredJson<StoredAudioPlayerState>(
  sessionStorage,
  "audioplayer",
);
const initialState: AudioPlayerState = {
  viewingSongList:
    audioPlayer?.viewingSongList ?? audioPlayer?.viewingSonglist ?? null,
  playingSongList:
    audioPlayer?.playingSongList ?? audioPlayer?.playingSonglist ?? null,
  playingIndex: audioPlayer?.playingIndex ?? null,
  searchPlayback: audioPlayer?.searchPlayback ?? null,
};
const sync = (state: AudioPlayerState) => {
  writeStoredJson(sessionStorage, "audioplayer", state);
};
export const SEARCH_QUEUE_REFRESH_TRACKS = 20;
const audioPlayerSlice = createSlice({
  name: "audioplayer",
  initialState,
  reducers: {
    startSearchPlayback: (
      state,
      { payload }: PayloadAction<StartSearchPlaybackPayload>,
    ) => {
      state.playingSongList = { [payload.song.song_id]: payload.song };
      state.playingIndex = payload.song.song_id;
      state.searchPlayback = { sessionId: payload.sessionId, trackChanges: 0 };
      sync(state);
    },
    refreshSearchQueue: (
      state,
      { payload }: PayloadAction<RefreshSearchQueuePayload>,
    ) => {
      if (
        state.searchPlayback?.sessionId !== payload.sessionId ||
        Math.floor(
          state.searchPlayback.trackChanges / SEARCH_QUEUE_REFRESH_TRACKS,
        ) !== payload.refreshSlot
      )
        return;
      const current = state.playingSongList?.[state.playingIndex ?? ""];
      if (!current) return;
      state.playingSongList = indexSongs([
        current,
        ...payload.songs.filter((song) => song.song_id !== current.song_id),
      ]);
      sync(state);
    },
    playSong: (state, action: PayloadAction<string>) => {
      if (!state.viewingSongList?.[action.payload]) return;
      state.playingSongList = { ...state.viewingSongList };
      state.playingIndex = action.payload;
      state.searchPlayback = null;
      sync(state);
    },
    setViewingSongList: (state, action: PayloadAction<SongMap | null>) => {
      state.viewingSongList = action.payload;
      sync(state);
    },
    addViewingSong: (state, action: PayloadAction<Song>) => {
      const { song_id } = action.payload;
      if (!state.viewingSongList) {
        state.viewingSongList = {};
      }
      state.viewingSongList[song_id] = action.payload;
      sync(state);
    },
    deleteViewingSong: (state, action: PayloadAction<string>) => {
      if (state.viewingSongList) delete state.viewingSongList[action.payload];
      sync(state);
    },
    deleteSong: (state, action: PayloadAction<string>) => {
      const songId = action.payload;
      if (state.viewingSongList) delete state.viewingSongList[songId];
      if (state.playingSongList) delete state.playingSongList[songId];
      if (state.playingIndex === songId) {
        state.playingIndex =
          Object.keys(state.playingSongList ?? {})[0] ?? null;
      }
      sync(state);
    },
    renameViewingSong: (state, action: PayloadAction<RenameSongPayload>) => {
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
      state.searchPlayback = null;
      state.playingSongList = { ...state.viewingSongList };
      sync(state);
    },
    setPlayingIndex: (state, action: PayloadAction<string | null>) => {
      state.playingIndex = action.payload;
      sync(state);
    },
    clearPlayingContext: (state) => {
      state.searchPlayback = null;
      state.playingIndex = null;
      state.playingSongList = null;
      sync(state);
    },
    playNext: (state, { payload }: PayloadAction<string | undefined>) => {
      if (state.playingSongList && Object.keys(state.playingSongList).length) {
        const keys = Object.keys(state.playingSongList);
        const currentPos = keys.indexOf(String(state.playingIndex));
        state.playingIndex =
          payload && keys.includes(payload)
            ? payload
            : keys[(currentPos + 1) % keys.length];
        if (state.searchPlayback) state.searchPlayback.trackChanges++;
        sync(state);
      }
    },
    playPrevious: (state) => {
      if (state.playingSongList && Object.keys(state.playingSongList).length) {
        const keys = Object.keys(state.playingSongList);
        const currentPos = keys.indexOf(String(state.playingIndex));
        state.playingIndex = keys[(currentPos - 1 + keys.length) % keys.length];
        if (state.searchPlayback) state.searchPlayback.trackChanges++;
        sync(state);
      }
    },
  },
});
export const {
  playSong,
  startSearchPlayback,
  refreshSearchQueue,
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
