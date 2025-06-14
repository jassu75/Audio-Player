import { createSlice } from "@reduxjs/toolkit";

const Expiry = 7 * 24 * 60 * 60 * 1000;

const checkExpired = (key, defaultValue) => {
  const storedItem = localStorage.getItem(key);
  if (!storedItem) {
    return defaultValue;
  }
  const { data, timestamp } = JSON.parse(storedItem);
  if (Date.now() - timestamp < Expiry) {
    return data;
  } else {
    localStorage.removeItem(key);
    return defaultValue;
  }
};

const initialState = {
  songs: JSON.parse(sessionStorage.getItem("songsList")) || null,
  user: JSON.parse(sessionStorage.getItem("user")) || null,
  playlists: JSON.parse(sessionStorage.getItem("playlists")) || null,
  jamendoSongs: checkExpired("jamendoSongs", null),
  audiusAlbums: checkExpired("audiusAlbums", null),
  audiusSongs: null,
};

const songsSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    setSongs: (state, action) => {
      state.songs = action.payload;
      sessionStorage.setItem("songsList", JSON.stringify(action.payload));
    },
    addSongs: (state, action) => {
      const { id, ...songWithoutId } = action.payload;
      if (!state.songs) {
        state.songs = {};
      }
      state.songs[id] = songWithoutId;
      sessionStorage.setItem("songsList", JSON.stringify(state.songs));
    },
    deleteSong: (state, action) => {
      delete state.songs[action.payload];
      sessionStorage.setItem("songsList", JSON.stringify(state.songs));
    },

    setPlaylistDetails: (state, action) => {
      state.playlists = action.payload;
      sessionStorage.setItem("playlists", JSON.stringify(action.payload));
    },
    addPlaylistDetails: (state, action) => {
      const { id, ...playlistWithoutId } = action.payload;
      if (!state.playlists) {
        state.playlists = {};
      }
      state.playlists[id] = playlistWithoutId;
      sessionStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    deletePlaylistDetails: (state, action) => {
      delete state.playlists[action.payload];
      sessionStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    setHomepageSongTitles: (state, action) => {
      state.user.homepage_songs = action.payload;
      sessionStorage.setItem("user", JSON.stringify(state.user));
    },
    addHomepageSongId: (state, action) => {
      state.user.homepage_songs = [
        ...state.user.homepage_songs,
        action.payload,
      ];
      sessionStorage.setItem("user", JSON.stringify(state.user));
    },
    setPlaylistSongs: (state, action) => {
      const { id, playlistSongs } = action.payload;
      state.playlists[id].playlist_songs = playlistSongs;
      sessionStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    addPlaylistSongs: (state, action) => {
      const { id, playlistSongId } = action.payload;
      state.playlists[id].playlist_songs.push(playlistSongId);
      sessionStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    setPlaylistIds: (state, action) => {
      state.user.playlist_ids = action.payload;
      sessionStorage.setItem("user", JSON.stringify(state.user));
    },
    addPlaylistIds: (state, action) => {
      state.user.playlist_ids.push(action.payload);
      sessionStorage.setItem("user", JSON.stringify(state.user));
    },

    setUser: (state, action) => {
      state.user = action.payload;
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    },

    setJamendoSongs: (state, action) => {
      state.jamendoSongs = action.payload;
      const data = {
        data: action.payload,
        timestamp: Date.now(),
      };
      localStorage.setItem("jamendoSongs", JSON.stringify(data));
    },

    setAudiusAlbums: (state, action) => {
      state.audiusAlbums = action.payload;
      const data = {
        data: action.payload,
        timestamp: Date.now(),
      };
      localStorage.setItem("audiusAlbums", JSON.stringify(data));
    },
    setAudiusSongs: (state, action) => {
      state.audiusSongs = action.payload;
    },
    logout: () => initialState,
  },
});

export const {
  setSongs,
  addSongs,
  removeHomepageSong,
  setUser,
  setHomepageSongTitles,
  addHomepageSongId,
  setPlaylistIds,
  addPlaylistIds,
  addPlaylistDetails,
  setPlaylistDetails,
  deletePlaylistDetails,
  deleteSong,
  setPlaylistSongs,
  addPlaylistSongs,
  setJamendoSongs,
  setAudiusSongs,
  setAudiusAlbums,
  logout,
} = songsSlice.actions;
export default songsSlice.reducer;
