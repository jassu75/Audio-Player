import { loadForYouPlaylists, loadSystemPlaylists, loadUserPlaylists } from "../services/playlistCollections";
import type { PlaylistCollectionConfig } from "./types/playlistCollections.types";

export const PLAYLIST_COLLECTIONS: PlaylistCollectionConfig[] = [
    {
        id: "for-you",
        title: "For You",
        type: "personal",
        loadPlaylists: loadForYouPlaylists,
        cache: false,
    },
    {
        id: "user",
        title: "Your Playlists",
        type: "user",
        loadPlaylists: loadUserPlaylists,
        cache: true,
    },
    {
        id: "system",
        title: "Popular Playlists",
        type: "system",
        loadPlaylists: loadSystemPlaylists,
        cache: true,
    },
];
