import { configureStore } from "@reduxjs/toolkit";
import songsReducer from "./Songlist/HomepageSongs/homepage.slice";

const store = configureStore({
  reducer: {
    homepage: songsReducer,
  },
});

export default store;
