import type { Playlist, PlaylistCollection } from "../../../../components/playlist-rail/types/playlist.types";

export interface PlaylistCollectionConfig extends Pick<PlaylistCollection, "id" | "title" | "type"> {
    loadPlaylists: (userId: string, signal: AbortSignal) => Promise<Playlist[]>;
    cache: boolean;
}
