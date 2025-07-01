import { combineReducers } from "redux";
import songsReducer from "../slices/homepage.slice";
import userPrefReducer from "../slices/userPreferences.slice";

const mainReducer = combineReducers({
  homepage: songsReducer,
  userPrefs: userPrefReducer,
});

export const logout = () => ({ type: "auth/logout" });

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return mainReducer(state, action);
};

export default rootReducer;
