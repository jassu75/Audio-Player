import type { RenamePlaylistPayload } from "./types/homepageSlice.types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { HomepageState } from "./types/homepageSlice.types";
import type {
  Playlist,
  PlaylistCollection,
} from "../../components/playlist-rail/types/playlist.types";
import type { UserProfile } from "../../hooks/types/useFetchUser.types";
import { readStoredJson, writeStoredJson } from "../../utils/storage";
const setInSessionStorage = (key: string, data: unknown) => {
  writeStoredJson(sessionStorage, key, data);
};
const getFromSessionStorage = <T>(key: string) => {
  return readStoredJson<T>(sessionStorage, key);
};
const initialState: HomepageState = {
  user: null,
  playlistCollection:
    getFromSessionStorage<PlaylistCollection[]>("playlistCollection"),
};
const homepageSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
    },
    setPlaylistCollection: (
      state,
      action: PayloadAction<PlaylistCollection[]>,
    ) => {
      state.playlistCollection = action.payload;
      setInSessionStorage("playlistCollection", action.payload);
    },
    addPlaylist: (state, action: PayloadAction<Playlist>) => {
      const newPlaylist = action.payload;
      const collection = state.playlistCollection?.find(
        (c) => c.type === "user",
      );
      if (collection) {
        collection.collection.push(newPlaylist);
      }
      setInSessionStorage("playlistCollection", state.playlistCollection);
    },
    deletePlaylist: (state, action: PayloadAction<string>) => {
      const playlistId = action.payload;
      const collection = state.playlistCollection?.find(
        (c) => c.type === "user",
      );
      if (collection) {
        const index = collection.collection.findIndex(
          (p) => p.playlist_id === playlistId,
        );
        if (index !== -1) collection.collection.splice(index, 1);
      }
      setInSessionStorage("playlistCollection", state.playlistCollection);
    },
    renamePlaylist: (state, action: PayloadAction<RenamePlaylistPayload>) => {
      const { playlistId, newTitle } = action.payload;
      const collection = state.playlistCollection?.find(
        (c) => c.type === "user",
      );
      const playlist = collection?.collection.find(
        (p) => p.playlist_id === playlistId,
      );
      if (playlist) playlist.playlist_title = newTitle;
      setInSessionStorage("playlistCollection", state.playlistCollection);
    },
  },
});
export const {
  setUser,
  setPlaylistCollection,
  addPlaylist,
  deletePlaylist,
  renamePlaylist,
} = homepageSlice.actions;
export default homepageSlice.reducer;
