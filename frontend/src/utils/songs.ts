import type { Song, SongMap } from "../components/playlist/playlist-songs-list/playlist-song/types/song.types";
export const indexSongs = (songs: (Song | null | undefined)[] = []): SongMap => Object.fromEntries(songs.filter((song): song is Song => Boolean(song?.song_id)).map((song) => [song.song_id, song]));
const isSong = (value: unknown): value is Song => {
    if (!value || typeof value !== "object")
        return false;
    const song = value as Partial<Song>;
    return typeof song.song_id === "string" && typeof song.title === "string" && typeof song.audio_url === "string"
        && typeof song.artist === "string" && typeof song.album === "string" && typeof song.cover_art === "string"
        && typeof song.duration === "number" && Array.isArray(song.genre) && song.genre.every((genre: unknown) => typeof genre === "string")
        && typeof song.release_year === "string";
};
export const normalizeRecentlyPlayed = (songs: unknown): Song[] | null => {
    if (!songs || typeof songs !== "object")
        return null;
    return Object.values(indexSongs(Object.values(songs).filter(isSong))).slice(0, 50);
};
