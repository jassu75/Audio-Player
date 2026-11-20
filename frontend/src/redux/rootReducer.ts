import { combineReducers } from "redux";
import audioPlayerReducer from "./slices/audioPlayerSlice";
import homepageReducer from "./slices/homepageSlice";
import userPreferencesReducer from "./slices/userPreferencesSlice";
const rootReducer = combineReducers({
    homepage: homepageReducer,
    userPrefs: userPreferencesReducer,
    audioplayer: audioPlayerReducer,
});
export default rootReducer;
