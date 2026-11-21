import type { Song } from "../../../components/playlist/playlist-songs-list/playlist-song/types/song.types";
export interface UserPreferencesState {
    listens: Record<string, number> | null;
    recentlyPlayed: Song[] | null;
    favorites: string[] | null;
    favoriteUpdates: Record<string, FavoriteUpdate>;
}

export interface FavoriteUpdate {
    requestId: string;
    pending: boolean;
    isFavorite?: boolean;
    error?: string;
}

export interface StartFavoriteUpdatePayload {
    songId: string;
    requestId: string;
    isFavorite: boolean;
}

export interface FinishFavoriteUpdatePayload {
    songId: string;
    requestId: string;
    error?: string;
}
