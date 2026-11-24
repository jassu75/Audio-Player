import type { PlaylistType } from "../../../../playlist-rail/types/playlist.types";
export interface PlaylistUploadButtonProps {
  playlistId: string;
  type: PlaylistType | undefined;
}
