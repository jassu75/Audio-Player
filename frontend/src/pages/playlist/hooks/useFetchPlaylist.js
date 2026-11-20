import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setViewingSongList } from "../../../redux/slices/audioPlayerSlice.js";

const useFetchPlaylist = (playlistId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        setError(false);
        dispatch(setViewingSongList(null));
        const response = await axios.post("/api/fetchPlaylistSongs", {
          playlist_id: playlistId,
        });

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
        if (active) dispatch(setViewingSongList(refinedResponse));
      } catch (error) {
        if (active) setError(true);
        console.error("Error fetching songs", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPlaylist();
    return () => {
      active = false;
    };
  }, [dispatch, playlistId]);

  return { loading, error };
};
export default useFetchPlaylist;
