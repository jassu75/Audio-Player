import type { Song } from "../../../playlist/playlist-songs-list/playlist-song/types/song.types";
export interface FavoriteCardProps {
    favorite: Song;
    songKey: string;
}
export interface GenreProps {
    genre: string[];
}
export interface AlbumAndTimeProps {
    album: string;
    year: string;
}
