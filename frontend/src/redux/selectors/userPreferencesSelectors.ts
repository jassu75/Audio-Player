import type { RootState } from "../types/store.types";
export const recentlyPlayedSelector = (state: RootState) =>
  state.userPrefs.recentlyPlayed;
export const favoritesSelector = (state: RootState) =>
  state.userPrefs.favorites;
export const listensSelector = (state: RootState) => state.userPrefs.listens;
