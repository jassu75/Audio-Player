import type { RootState } from "../types/store.types";
export const userSelector = (state: RootState) => state.homepage.user;
export const playlistCollectionSelector = (state: RootState) =>
  state.homepage.playlistCollection;
