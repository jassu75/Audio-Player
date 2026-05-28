import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewingSonglistSelector } from "../../../redux/selectors/audioplayer.selector";
import { setViewingSonglist } from "../../../redux/slices/audioplayer.slice";
import { userPlaylistsSelector } from "../../../redux/selectors/homepage.selector";

const useFetchUserPlaylist = (playlistId) => {
  const userPlaylists = useSelector(userPlaylistsSelector);
  const playlistTitle = userPlaylists?.[playlistId]?.playlist_title;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const songsList = useSelector(viewingSonglistSelector);
  useEffect(() => {
    const fetchUserPlaylist = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await axios.post(
          "/api/fetchPlaylistSongs",
          { playlist_id: playlistId },
          { headers: { "Content-Type": "application/json" } },
        );

        const refinedResponse = response.data.playlists.reduce(
          (acc, playlist) => {
            const song = playlist.songs;
            if (song && song.song_id) {
              acc[song.song_id] = song;
            }
            return acc;
          },
          {},
        );
        dispatch(setViewingSonglist(refinedResponse));
      } catch (error) {
        setError(true);
        console.error("Error fetching songs", error);
      } finally {
        setLoading(false);
      }
    };
    if (!songsList) {
      fetchUserPlaylist();
    }
  }, [dispatch, songsList, playlistId]);

  return { loading, error, playlistTitle };
};
export default useFetchUserPlaylist;
