import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../redux/rootReducer";
import type { Playlist } from "../components/playlist-rail/types/playlist.types";
import type { Song } from "../components/playlist/playlist-songs-list/playlist-song/types/song.types";
import type { UserProfile } from "../hooks/types/useFetchUser.types";
import type { TestStateOverrides } from "./types/fixtures.types";
export const makeSong = (overrides: Partial<Song> = {}): Song => ({
    song_id: "s1", title: "Original", artist: "Artist", album: "Album", duration: 120,
    genre: [], release_year: "2026", cover_art: "cover.jpg", audio_url: "https://example.com/one.mp3",
    ...overrides,
});
export const makePlaylist = (overrides: Partial<Playlist> = {}): Playlist => ({
    playlist_id: "p1", playlist_title: "Original", playlist_cover_art: "playlist_1_cover", ...overrides,
});
export const makeUser = (overrides: Partial<UserProfile> = {}): UserProfile => ({
    user_id: "u1", username: "Listener", email_id: "listener@example.com", ...overrides,
});
export const createTestStore = (overrides: TestStateOverrides = {}) => configureStore({
    reducer: rootReducer,
    preloadedState: {
        homepage: { user: null, playlistCollection: [], ...overrides.homepage },
        audioplayer: { viewingSongList: null, playingSongList: null, playingIndex: null, ...overrides.audioplayer },
        userPrefs: { favorites: [], recentlyPlayed: [], listens: {}, ...overrides.userPrefs },
    },
});
export const deferred = <T,>() => {
    let resolve: (value: T | PromiseLike<T>) => void = () => { throw new Error("Promise not initialized"); };
    const promise = new Promise<T>((done) => { resolve = done; });
    return { promise, resolve };
};
