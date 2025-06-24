import { createSelector } from "@reduxjs/toolkit";
import { songsSelector } from "./homepage.selector";

export const recentlyPlayedSelector = (state) => state.userPrefs.recentlyPlayed;
export const favoritesSelector = (state) => state.userPrefs.favorites;

export const recentlyPlayedSongsSelector = createSelector(
  [songsSelector, recentlyPlayedSelector],
  (songs, recentlyPlayed) => {
    if (!recentlyPlayed || !songs) return [];
    return recentlyPlayed.reduce((acc, id) => {
      if (songs[id]) {
        acc[id] = songs[id];
      }
      return acc;
    }, {});
  }
);
