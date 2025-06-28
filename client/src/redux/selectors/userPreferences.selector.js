import { createSelector } from "@reduxjs/toolkit";

export const recentlyPlayedSelector = (state) => state.userPrefs.recentlyPlayed;
export const favoritesSelector = (state) => state.userPrefs.favorites;

export const recentlyPlayedSongSelector = createSelector(
  [recentlyPlayedSelector],
  (songsList) => {
    if (!songsList) return {};
    return songsList.reduce((acc, song) => {
      acc[song.song_id] = song;
      return acc;
    }, {});
  }
);
