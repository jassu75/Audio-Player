import { combineReducers } from "redux";
import songsReducer from "../slices/homepage.slice";
import userPrefReducer from "../slices/userPreferences.slice";
import audioplayerReducer from "../slices/audioplayer.slice";

const mainReducer = combineReducers({
  homepage: songsReducer,
  userPrefs: userPrefReducer,
  audioplayer: audioplayerReducer,
});

export default mainReducer;
