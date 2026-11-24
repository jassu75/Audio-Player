import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type {
  Song,
  SongMap,
} from "../../components/playlist/playlist-songs-list/playlist-song/types/song.types";
import type {
  FinishFavoriteUpdatePayload,
  StartFavoriteUpdatePayload,
  UserPreferencesState,
} from "./types/userPreferencesSlice.types";
import { normalizeRecentlyPlayed } from "../../utils/songs";
import { readStoredJson, writeStoredJson } from "../../utils/storage";
const userPrefs = readStoredJson<UserPreferencesState>(
  sessionStorage,
  "userPrefs",
);
const initialState: UserPreferencesState = {
  favoriteUpdates: {},
  listens: userPrefs?.listens || null,
  recentlyPlayed: normalizeRecentlyPlayed(userPrefs?.recentlyPlayed),
  favorites: userPrefs?.favorites || null,
};
const persistPreferences = (state: UserPreferencesState) => {
  writeStoredJson(sessionStorage, "userPrefs", {
    favorites: state.favorites,
    recentlyPlayed: state.recentlyPlayed,
    listens: state.listens,
  });
};
const userPrefsSlice = createSlice({
  name: "userPrefs",
  initialState,
  reducers: {
    startFavoriteUpdate: (
      state,
      { payload }: PayloadAction<StartFavoriteUpdatePayload>,
    ) => {
      state.favoriteUpdates[payload.songId] = {
        requestId: payload.requestId,
        pending: true,
        isFavorite: payload.isFavorite,
      };
    },
    finishFavoriteUpdate: (
      state,
      { payload }: PayloadAction<FinishFavoriteUpdatePayload>,
    ) => {
      if (
        state.favoriteUpdates[payload.songId]?.requestId !== payload.requestId
      )
        return;
      if (payload.error) {
        state.favoriteUpdates[payload.songId] = {
          requestId: payload.requestId,
          pending: false,
          error: payload.error,
        };
      } else {
        delete state.favoriteUpdates[payload.songId];
      }
    },
    setRecentlyPlayed: (
      state,
      action: PayloadAction<Song[] | SongMap | null>,
    ) => {
      state.recentlyPlayed = normalizeRecentlyPlayed(action.payload);
      persistPreferences(state);
    },
    addRecentlyPlayed: (state, action: PayloadAction<Song>) => {
      if (!state.recentlyPlayed) state.recentlyPlayed = [];
      const newSong = {
        ...action.payload,
        last_played: new Date().toISOString(),
      };
      state.recentlyPlayed = state.recentlyPlayed.filter(
        (song) => song.song_id !== newSong.song_id,
      );
      state.recentlyPlayed.unshift(newSong);
      if (state.recentlyPlayed.length > 50) {
        state.recentlyPlayed.pop();
      }
      persistPreferences(state);
    },
    setListens: (state, action: PayloadAction<Record<string, number>>) => {
      state.listens = action.payload;
      persistPreferences(state);
    },
    addListens: (state, action: PayloadAction<string>) => {
      if (!state.listens) state.listens = {};
      const songId = action.payload;
      state.listens[songId] = (state.listens[songId] || 0) + 1;
      persistPreferences(state);
    },
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.favorites = action.payload;
      persistPreferences(state);
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favorites) state.favorites = [];
      if (!state.favorites.includes(action.payload))
        state.favorites.push(action.payload);
      persistPreferences(state);
    },
    deleteFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favorites) state.favorites = [];
      state.favorites = state.favorites.filter(
        (songId) => songId !== action.payload,
      );
      persistPreferences(state);
    },
  },
});
export const {
  setRecentlyPlayed,
  addRecentlyPlayed,
  addFavorite,
  deleteFavorite,
  setFavorites,
  addListens,
  setListens,
  startFavoriteUpdate,
  finishFavoriteUpdate,
} = userPrefsSlice.actions;
export default userPrefsSlice.reducer;
