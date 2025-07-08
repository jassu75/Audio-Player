import { combineReducers } from "redux";
import songsReducer from "../slices/homepage.slice";
import userPrefReducer from "../slices/userPreferences.slice";

const mainReducer = combineReducers({
  homepage: songsReducer,
  userPrefs: userPrefReducer,
});

export default mainReducer;
