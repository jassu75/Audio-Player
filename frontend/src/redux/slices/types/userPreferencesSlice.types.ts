import type { Song } from "../../../components/playlist/playlist-songs-list/playlist-song/types/song.types";
export interface UserPreferencesState {
    listens: Record<string, number> | null;
    recentlyPlayed: Song[] | null;
    favorites: string[] | null;
}
