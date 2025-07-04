import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSongs } from "../../redux/slices/homepage.slice";
import { songsSelector } from "../../redux/selectors/homepage.selector";

const useFetchSongs = (playlistId) => {
  const [songsLoading, setSongsLoading] = useState(false);
  const [songsError, setSongsError] = useState(false);
  const dispatch = useDispatch();
  const songsList = useSelector(songsSelector);
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setSongsLoading(true);
        setSongsError(false);
        const response = await axios.post(
          "/api/fetchPlaylistSongs",
          { playlist_id: playlistId },
          { headers: { "Content-Type": "application/json" } }
        );

        const songsHashMap = response.data.playlists.reduce((acc, playlist) => {
          const song = playlist.songs;
          if (song && song.song_id) {
            acc[song.song_id] = song;
          }
          return acc;
        }, {});
        dispatch(setSongs(songsHashMap));
      } catch (error) {
        setSongsError(true);
        console.error("Error fetching songs", error);
      } finally {
        setSongsLoading(false);
      }
    };
    if (!songsList) {
      fetchSongs();
    }
  }, [dispatch, songsList, playlistId]);

  return { songsLoading, songsError };
};
export default useFetchSongs;
