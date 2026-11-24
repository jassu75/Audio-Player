import type { PlaylistType } from "../../../../playlist-rail/types/playlist.types";
import type { Song } from "./song.types";
export interface PlaylistSongProps {
  playlistId: string;
  type: PlaylistType | undefined;
  song: Song;
}
