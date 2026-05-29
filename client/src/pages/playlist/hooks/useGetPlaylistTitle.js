import { useSelector } from "react-redux";
import {
  audiusPlaylistsSelector,
  userPlaylistsSelector,
} from "../../../redux/selectors/homepage.selector";

const useGetPlaylistTitle = (collection, playlistId) => {
  const userPlaylists = useSelector(userPlaylistsSelector);
  const audiusPlaylists = useSelector(audiusPlaylistsSelector);

  const PLAYLIST_TITLE_MAP = {
    "most-played": "Audio in Most Played",
    "recently-played": "Audio in Recently Played",
    jamendo: "Audio in Jamendo",
    "user-playlist": `Audio in ${userPlaylists?.[playlistId]?.playlist_title}`,
    audius: `Audio in ${audiusPlaylists?.[playlistId]?.title}`,
  };

  return PLAYLIST_TITLE_MAP[collection] ?? "";
};

export default useGetPlaylistTitle;
