import { createSelector } from "@reduxjs/toolkit";

export const viewingSonglistSelector = (state) =>
  state.audioplayer.viewingSonglist;
export const playingSonglistSelector = (state) =>
  state.audioplayer.playingSonglist;
export const playingIndexSelector = (state) => state.audioplayer.playingIndex;

export const currentSongSelector = (state) =>
  state.audioplayer.playingSonglist?.[playingIndexSelector(state)] ?? null;

export const searchviewingSonglistSelector = createSelector(
  [viewingSonglistSelector],
  (songs) => {
    if (!songs) return [];
    const titles = new Set();
    return Object.fromEntries(
      Object.entries(songs).filter(([_id, song]) => {
        if (titles.has(song.title)) return false;
        titles.add(song.title);
        return true;
      }),
    );
  },
);

export const filteredSearchSongSelector = (query) =>
  createSelector([viewingSonglistSelector], (songs) => {
    if (!query || !songs) return [];

    const titles = new Set();
    const searchText = query.toLowerCase();

    return Object.fromEntries(
      Object.entries(songs).filter(([_id, song]) => {
        const title = song.title?.toLowerCase() || "";
        if (title.includes(searchText) && !titles.has(title)) {
          titles.add(title);
          return true;
        }
        return false;
      }),
    );
  });
