export interface Playlist {
    playlist_id: string;
    playlist_title: string;
    playlist_cover_art: string;
    source?: string;
}
export type PlaylistType = "user" | "system";
export interface PlaylistCollection {
    id: string;
    title: string;
    type: PlaylistType;
    collection: Playlist[];
}
