import { combineReducers } from "redux";
import homepageReducer from "./slices/homepageSlice.js";
import userPreferencesReducer from "./slices/userPreferencesSlice.js";
import audioPlayerReducer from "./slices/audioPlayerSlice.js";

const rootReducer = combineReducers({
  homepage: homepageReducer,
  userPrefs: userPreferencesReducer,
  audioplayer: audioPlayerReducer,
});

export default rootReducer;
