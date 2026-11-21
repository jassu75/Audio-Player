export interface Song {
    song_id: string;
    title: string;
    artist: string;
    album: string;
    duration: number;
    genre: string[];
    release_year: string;
    cover_art: string;
    audio_url: string;
    cover_art_id?: string | null;
    audio_url_id?: string | null;
    last_played?: string | null;
    user_id?: string | null;
    listens?: number;
    source?: string;
}
export type SongMap = Record<string, Song>;
