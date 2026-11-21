import type { Song } from "../../../playlist/playlist-songs-list/playlist-song/types/song.types";

export interface MediaSessionControls {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  stop: () => void;
}

export interface MediaSessionConnection {
  setTrack: (song: Song | null) => void;
  dispose: () => void;
}
