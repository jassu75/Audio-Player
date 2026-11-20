import type { PlaylistType } from "../../../components/playlist-rail/types/playlist.types";
export const PLAYLIST_COLLECTIONS: {
    id: string;
    title: string;
    type: PlaylistType;
}[] = [
    { id: "user", title: "Your Playlists", type: "user" },
    { id: "system", title: "Popular Playlists", type: "system" },
];
