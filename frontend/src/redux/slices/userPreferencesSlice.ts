import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Song, SongMap } from "../../components/playlist/playlist-songs-list/playlist-song/types/song.types";
import type { UserPreferencesState } from "./types/userPreferencesSlice.types";
import { normalizeRecentlyPlayed } from "../../utils/songs";
import { readStoredJson, writeStoredJson } from "../../utils/storage";
const userPrefs = readStoredJson<UserPreferencesState>(sessionStorage, "userPrefs");
const initialState: UserPreferencesState = {
    listens: userPrefs?.listens || null,
    recentlyPlayed: normalizeRecentlyPlayed(userPrefs?.recentlyPlayed),
    favorites: userPrefs?.favorites || null,
};
const userPrefsSlice = createSlice({
    name: "userPrefs",
    initialState,
    reducers: {
        setRecentlyPlayed: (state, action: PayloadAction<Song[] | SongMap | null>) => {
            state.recentlyPlayed = normalizeRecentlyPlayed(action.payload);
            writeStoredJson(sessionStorage, "userPrefs", state);
        },
        addRecentlyPlayed: (state, action: PayloadAction<Song>) => {
            if (!state.recentlyPlayed)
                state.recentlyPlayed = [];
            const newSong = {
                ...action.payload,
                last_played: new Date().toISOString(),
            };
            state.recentlyPlayed = state.recentlyPlayed.filter((song) => song.song_id !== newSong.song_id);
            state.recentlyPlayed.unshift(newSong);
            if (state.recentlyPlayed.length > 50) {
                state.recentlyPlayed.pop();
            }
            writeStoredJson(sessionStorage, "userPrefs", state);
        },
        setListens: (state, action: PayloadAction<Record<string, number>>) => {
            state.listens = action.payload;
            writeStoredJson(sessionStorage, "userPrefs", state);
        },
        addListens: (state, action: PayloadAction<string>) => {
            if (!state.listens)
                state.listens = {};
            const songId = action.payload;
            state.listens[songId] = (state.listens[songId] || 0) + 1;
            writeStoredJson(sessionStorage, "userPrefs", state);
        },
        setFavorites: (state, action: PayloadAction<string[]>) => {
            state.favorites = action.payload;
            writeStoredJson(sessionStorage, "userPrefs", state);
        },
        addFavorite: (state, action: PayloadAction<string>) => {
            if (!state.favorites)
                state.favorites = [];
            if (!state.favorites.includes(action.payload))
                state.favorites.push(action.payload);
            writeStoredJson(sessionStorage, "userPrefs", state);
        },
        deleteFavorite: (state, action: PayloadAction<string>) => {
            if (!state.favorites)
                state.favorites = [];
            state.favorites = state.favorites.filter((songId) => songId !== action.payload);
            writeStoredJson(sessionStorage, "userPrefs", state);
        },
    },
});
export const { setRecentlyPlayed, addRecentlyPlayed, addFavorite, deleteFavorite, setFavorites, addListens, setListens, } = userPrefsSlice.actions;
export default userPrefsSlice.reducer;
