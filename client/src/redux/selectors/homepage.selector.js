import { createSelector } from "@reduxjs/toolkit";

export const songsSelector = (state) => state.homepage.songs;
export const playlistsSelector = (state) => state.homepage.playlists;
export const userSelector = (state) => state.homepage.user;
export const jamendoSongsSelector = (state) => state.homepage.jamendoSongs;
export const audiusAlbumsSelector = (state) => state.homepage.audiusAlbums;
export const audiusSongsSelector = (state) => state.homepage.audiusSongs;

export const userSongsSelector = createSelector([userSelector], (user) => {
  if (!user) return [];
  return user.homepage_songs;
});

export const homepageSongsSelector = createSelector(
  [songsSelector, userSelector],
  (songs, user) => {
    if (!user || !songs) return [];
    return user.homepage_songs.reduce((acc, id) => {
      if (songs[id]) {
        acc[id] = songs[id];
      }
      return acc;
    }, {});
  }
);

export const playlistSongsSelector = (playlistId) =>
  createSelector([playlistsSelector, songsSelector], (playlists, songs) => {
    if (!playlists || !songs) return [];
    const songIds = playlists?.[playlistId].playlist_songs;
    return songIds.reduce((acc, id) => {
      if (songs[id]) {
        acc[id] = songs[id];
      }
      return acc;
    }, {});
  });

export const searchSongsSelector = createSelector([songsSelector], (songs) => {
  if (!songs) return [];
  const titles = new Set();
  return Object.fromEntries(
    Object.entries(songs).filter(([id, song]) => {
      if (titles.has(song.title)) return false;
      titles.add(song.title);
      return true;
    })
  );
});
