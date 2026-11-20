import type { PlaylistType } from "../../../playlist-rail/types/playlist.types";
export interface PlaylistSongsListProps {
    playlistId: string;
    type: PlaylistType | undefined;
    page: number;
}
