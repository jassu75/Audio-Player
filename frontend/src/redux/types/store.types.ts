import type store from "../store";
import type rootReducer from "../rootReducer";
export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<typeof rootReducer>;
