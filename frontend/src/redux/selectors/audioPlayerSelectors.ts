import type { RootState } from "../types/store.types";
export const viewingSongListSelector = (state: RootState) => state.audioplayer.viewingSongList;
export const playingSongListSelector = (state: RootState) => state.audioplayer.playingSongList;
export const playingIndexSelector = (state: RootState) => state.audioplayer.playingIndex;
export const currentSongSelector = (state: RootState) => state.audioplayer.playingSongList?.[(playingIndexSelector(state) ?? "")] ?? null;
