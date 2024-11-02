import { createSlice } from '@reduxjs/toolkit';

const songsSlice = createSlice({
    name: 'songs',
    initialState: {
        songs: {},
    },
    reducers: {
        setSongs: (state, action) => {
            const songsHashMap = action.payload.reduce((acc, song) => {
                acc[song.id] = song;
                return acc;
            }, {});
            state.songs = songsHashMap; 
        },
    },
});

export const { setSongs } = songsSlice.actions;
export default songsSlice.reducer;
