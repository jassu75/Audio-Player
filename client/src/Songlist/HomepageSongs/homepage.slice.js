import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  songs: JSON.parse(localStorage.getItem("songsList")) || {},
  user: JSON.parse(localStorage.getItem("user")) || null,
  playlists: JSON.parse(localStorage.getItem("playlists")) || {},
  jamendoSongs: null,
};

const songsSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    setSongs: (state, action) => {
      state.songs = action.payload;
      localStorage.setItem("songsList", JSON.stringify(state.songs));
    },
    addSongs: (state, action) => {
      const { title, ...songWithoutTitle } = action.payload;
      state.songs[title] = songWithoutTitle;
      localStorage.setItem("songsList", JSON.stringify(state.songs));
    },

    setPlaylistDetails: (state, action) => {
      state.playlists = action.payload;
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    addPlaylistDetails: (state, action) => {
      const { id, ...playlistWithoutId } = action.payload;
      state.playlists[id] = playlistWithoutId;
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    deletePlaylistDetails: (state, action) => {
      delete state.playlists[action.payload];
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    setHomepageSongTitles: (state, action) => {
      state.user.homepage_songs = action.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    addHomepageSongTitles: (state, action) => {
      state.user.homepage_songs.push(action.payload);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    setPlaylistSongs: (state, action) => {
      const { id, playlistSongs } = action.payload;
      state.playlists[id].playlist_songs = playlistSongs;
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    addPlaylistSongs: (state, action) => {
      const { id, playlistSongTitle } = action.payload;
      state.playlists[id].playlist_songs.push(playlistSongTitle);
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    setPlaylistIds: (state, action) => {
      state.user.playlist_ids = action.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    addPlaylistIds: (state, action) => {
      state.user.playlist_ids.push(action.payload);
      localStorage.setItem("user", JSON.stringify(state.user));
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    setJamendoSongs: (state, action) => {
      state.jamendoSongs = action.payload;
    },
  },
});

export const {
  setSongs,
  addSongs,
  removeHomepageSong,
  setUser,
  setHomepageSongTitles,
  addHomepageSongTitles,
  setPlaylistIds,
  addPlaylistIds,
  addPlaylistDetails,
  setPlaylistDetails,
  deletePlaylistDetails,
  setPlaylistSongs,
  addPlaylistSongs,
  setJamendoSongs,
} = songsSlice.actions;
export default songsSlice.reducer;
