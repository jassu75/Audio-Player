import type { Playlist } from "../../../../../playlist-rail/types/playlist.types";
export interface MoveSongProps {
    open: boolean;
    onClose: () => void;
    songId: string;
    playlistId: string;
}
export interface PlaylistSelectorProps {
    filteredPlaylists: Playlist[];
    selected: string | null;
    handleSelect: (id: string) => void;
}
