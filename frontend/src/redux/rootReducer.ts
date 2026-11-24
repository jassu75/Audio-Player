import { combineReducers } from "redux";
import type { UnknownAction } from "redux";
import { createAction } from "@reduxjs/toolkit";
import audioPlayerReducer from "./slices/audioPlayerSlice";
import homepageReducer from "./slices/homepageSlice";
import userPreferencesReducer from "./slices/userPreferencesSlice";
export const resetSessionState = createAction("session/reset");
const combinedReducer = combineReducers({
  homepage: homepageReducer,
  userPrefs: userPreferencesReducer,
  audioplayer: audioPlayerReducer,
});
const rootReducer = (
  state: Parameters<typeof combinedReducer>[0],
  action: UnknownAction,
) =>
  combinedReducer(
    resetSessionState.match(action)
      ? {
          homepage: { user: null, playlistCollection: null },
          userPrefs: {
            favorites: null,
            recentlyPlayed: null,
            listens: null,
            favoriteUpdates: {},
          },
          audioplayer: {
            viewingSongList: null,
            playingSongList: null,
            playingIndex: null,
            searchPlayback: null,
          },
        }
      : state,
    action,
  );
export default rootReducer;
