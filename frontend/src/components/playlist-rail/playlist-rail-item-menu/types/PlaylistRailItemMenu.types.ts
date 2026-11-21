import type { Playlist } from "../../types/playlist.types";
import type usePlaylistRailItem from "../../playlist-rail-item/hooks/usePlaylistRailItem";
export interface PlaylistRailItemMenuProps {
    playlist: Playlist;
    playlistRailItemProps: ReturnType<typeof usePlaylistRailItem>;
}
