import { createSelector } from "@reduxjs/toolkit";
import { viewingSonglistSelector } from "./audioplayer.selector";

export const playlistsSelector = (state) => state.homepage.playlists;
export const userSelector = (state) => state.homepage.user;
export const jamendoSongslistSelector = (state) => state.homepage.jamendoSongs;
export const audiusAlbumsSelector = (state) => state.homepage.audiusAlbums;
export const audiusviewingSonglistSelector = (state) =>
  state.homepage.audiusSongs;
export const currentSongSelector = (state) => state.homepage.currentSong;

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
