import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setViewingSonglist } from "../../../redux/slices/audioplayer.slice";

const useFetchUserPlaylist = (playlistId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserPlaylist = async () => {
      try {
        setLoading(true);
        setError(false);
        dispatch(setViewingSonglist(null));
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

    fetchUserPlaylist();
  }, [dispatch, playlistId]);

  return { loading, error };
};
export default useFetchUserPlaylist;
