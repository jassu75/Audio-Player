import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./reducers/main.reducer";

const store = configureStore({
  reducer: rootReducer,
});

export default store;
