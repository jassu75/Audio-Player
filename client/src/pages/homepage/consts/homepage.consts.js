import useFetchSystemPlaylists from "../hooks/helpers/useFetchSystemPlaylists";
import useFetchUserPlaylists from "../hooks/helpers/useFetchUserPlaylists";

export const PLAYLIST_COLLECTION_CONFIG = [
  {
    id: crypto.randomUUID(),
    title: "Your Playlists",
    type: "user",
    hook: useFetchUserPlaylists,
  },
  {
    id: crypto.randomUUID(),
    title: "Popular Playlists",
    type: "system",
    hook: useFetchSystemPlaylists,
  },
];
