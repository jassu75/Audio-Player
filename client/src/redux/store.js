import { configureStore } from "@reduxjs/toolkit";
import songsReducer from "./slices/homepage.slice";

const store = configureStore({
  reducer: {
    homepage: songsReducer,
  },
});

export default store;
