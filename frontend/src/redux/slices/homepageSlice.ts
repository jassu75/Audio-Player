import type { RenamePlaylistPayload } from "./types/homepageSlice.types";
import type { CachedValue } from "../../utils/types/storage.types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { HomepageState } from "./types/homepageSlice.types";
import type { Playlist, PlaylistCollection } from "../../components/playlist-rail/types/playlist.types";
import type { UserProfile } from "../../hooks/types/useFetchUser.types";
import { readStoredJson, writeStoredJson } from "../../utils/storage";
const EXPIRY = {
    user: 7 * 24 * 60 * 60 * 1000,
    playlistCollection: 30 * 24 * 60 * 60 * 1000,
};
const checkExpired = <T,>(key: keyof typeof EXPIRY, defaultValue: T): T => {
    const storedItem = readStoredJson<CachedValue<T>>(localStorage, key);
    if (!storedItem)
        return defaultValue;
    const { data, timestamp } = storedItem;
    if (Date.now() - timestamp < EXPIRY[key]) {
        return data;
    }
    else {
        return defaultValue;
    }
};
const setWithTimestamp = (key: string, data: unknown) => {
    writeStoredJson(localStorage, key, { data, timestamp: Date.now() });
};
const setInSessionStorage = (key: string, data: unknown) => {
    writeStoredJson(sessionStorage, key, data);
};
const getFromSessionStorage = <T,>(key: string) => {
    return readStoredJson<T>(sessionStorage, key);
};
const initialState: HomepageState = {
    user: checkExpired<UserProfile | null>("user", null),
    playlistCollection: getFromSessionStorage<PlaylistCollection[]>("playlistCollection"),
};
const homepageSlice = createSlice({
    name: "homepage",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserProfile | null>) => {
            state.user = action.payload;
            setWithTimestamp("user", action.payload);
        },
        setPlaylistCollection: (state, action: PayloadAction<PlaylistCollection[]>) => {
            state.playlistCollection = action.payload;
            setInSessionStorage("playlistCollection", action.payload);
        },
        addPlaylist: (state, action: PayloadAction<Playlist>) => {
            const newPlaylist = action.payload;
            const collection = state.playlistCollection?.find((c) => c.type === "user");
            if (collection) {
                collection.collection.push(newPlaylist);
            }
            setInSessionStorage("playlistCollection", state.playlistCollection);
        },
        deletePlaylist: (state, action: PayloadAction<string>) => {
            const playlistId = action.payload;
            const collection = state.playlistCollection?.find((c) => c.type === "user");
            if (collection) {
                const index = collection.collection.findIndex((p) => p.playlist_id === playlistId);
                if (index !== -1)
                    collection.collection.splice(index, 1);
            }
            setInSessionStorage("playlistCollection", state.playlistCollection);
        },
        renamePlaylist: (state, action: PayloadAction<RenamePlaylistPayload>) => {
            const { playlistId, newTitle } = action.payload;
            const collection = state.playlistCollection?.find((c) => c.type === "user");
            const playlist = collection?.collection.find((p) => p.playlist_id === playlistId);
            if (playlist)
                playlist.playlist_title = newTitle;
            setInSessionStorage("playlistCollection", state.playlistCollection);
        },
    },
});
export const { setUser, setPlaylistCollection, addPlaylist, deletePlaylist, renamePlaylist, } = homepageSlice.actions;
export default homepageSlice.reducer;
