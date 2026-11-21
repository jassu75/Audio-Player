import forYou from "../../../assets/json/forYou.json";
import axiosAuth from "../../../config/axiosAuth";
import type { Playlist } from "../../../components/playlist-rail/types/playlist.types";

export const loadForYouPlaylists = async (): Promise<Playlist[]> =>
  forYou.data.map((playlist) => ({
    playlist_id: playlist.id,
    playlist_title: playlist.title,
    playlist_cover_art: playlist.cover_art,
    path: playlist.path,
  }));

export const loadUserPlaylists = async (
  userId: string,
  signal: AbortSignal,
): Promise<Playlist[]> => {
  const response = await axiosAuth.post<{ playlist_details: Playlist[] }>(
    "/api/getPlaylists",
    { user_id: userId },
    { signal },
  );
  return response.data.playlist_details;
};

export const loadSystemPlaylists = async (
  _userId: string,
  signal: AbortSignal,
): Promise<Playlist[]> => {
  const response = await axiosAuth.get<{ playlist_details: Playlist[] }>(
    "/api/fetch-system-playlists",
    { signal },
  );
  return response.data.playlist_details;
};
