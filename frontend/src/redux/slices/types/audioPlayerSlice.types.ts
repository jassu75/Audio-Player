import type {
  Song,
  SongMap,
} from "../../../components/playlist/playlist-songs-list/playlist-song/types/song.types";
export interface AudioPlayerState {
  viewingSongList: SongMap | null;
  playingSongList: SongMap | null;
  playingIndex: string | null;
  searchPlayback: SearchPlaybackState | null;
}
export interface SearchPlaybackState {
  sessionId: string;
  trackChanges: number;
}
export interface StartSearchPlaybackPayload {
  song: Song;
  sessionId: string;
}
export interface RefreshSearchQueuePayload {
  sessionId: string;
  refreshSlot: number;
  songs: Song[];
}
export interface StoredAudioPlayerState extends Partial<AudioPlayerState> {
  viewingSonglist?: SongMap;
  playingSonglist?: SongMap;
}
export interface RenameSongPayload {
  songId: string;
  newTitle: string;
}
