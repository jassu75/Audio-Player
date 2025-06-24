import { configureStore } from "@reduxjs/toolkit";
import songsReducer from "./slices/homepage.slice";
import userPrefReducer from "./slices/userPreferences.slice";

const store = configureStore({
  reducer: {
    homepage: songsReducer,
    userPrefs: userPrefReducer,
  },
});

export default store;
