import useFetchAudius from "../hooks/useFetchAudius";
import useFetchJamendo from "../hooks/useFetchJamendo";
import useFetchMostListened from "../hooks/useFetchMostListened";
import useFetchRecentlyPlayed from "../hooks/useFetchRecentlyPlayed";
import useFetchUserPlaylist from "../hooks/useFetchUserPlaylist";

export const PLAYLIST_HOOK_MAP = {
  "most-played": useFetchMostListened,
  "recently-played": useFetchRecentlyPlayed,
  "user-playlist": useFetchUserPlaylist,
  jamendo: useFetchJamendo,
  audius: useFetchAudius,
};
