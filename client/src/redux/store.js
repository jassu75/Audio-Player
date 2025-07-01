import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./reducers/mainReducer";

const store = configureStore({
  reducer: rootReducer,
});

export default store;
