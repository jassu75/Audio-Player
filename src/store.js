import { configureStore } from '@reduxjs/toolkit';
import songsReducer from './Songlist/HomepageSongs/homepageSlice'

const store = configureStore({
    reducer: {
        songs: songsReducer,
    },
});

export default store;
