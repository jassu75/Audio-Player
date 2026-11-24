import type { UserProfile } from "../../../hooks/types/useFetchUser.types";
import type { PlaylistCollection } from "../../../components/playlist-rail/types/playlist.types";
export interface HomepageState {
  user: UserProfile | null;
  playlistCollection: PlaylistCollection[] | null;
}
export interface RenamePlaylistPayload {
  playlistId: string;
  newTitle: string;
}
