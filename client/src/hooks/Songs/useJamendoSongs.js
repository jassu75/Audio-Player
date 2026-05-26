import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setJamendoSongs } from "../../redux/slices/homepage.slice";
import { setViewingSonglist } from "../../redux/slices/audioplayer.slice";
import { jamendoSongslistSelector } from "../../redux/selectors/homepage.selector";
import { viewingSonglistSelector } from "../../redux/selectors/audioplayer.selector";

const useJamendoSongs = () => {
  const [jamendoSongsLoading, setJamendoSongsLoading] = useState(false);
  const [jamendoSongsError, setJamendoSongsError] = useState(false);
  const dispatch = useDispatch();
  const jamendoSongs = useSelector(jamendoSongslistSelector);
  const songsList = useSelector(viewingSonglistSelector);

  useEffect(() => {
    const fetchJamendoSongs = async () => {
      try {
        setJamendoSongsLoading(true);
        const response = await axios.get("/api/jamendo/fetchTopSongs");
        const refinedSongs = response.data.results.reduce((acc, song) => {
          acc[song.id] = {
            song_id: song.id,
            title: song.name,
            duration: song.duration,
            album: song.album_name || song.name,
            audio_url: song.audio,
            cover_art: song.album_image,
            release_year: song.releasedate?.split("-")[0] || "",
            artist: song.artist_name,
            genre: song.musicinfo?.tags?.genres || [],
            last_played: null,
            cover_art_id: null,
            audio_url_id: null,
          };
          return acc;
        }, {});
        dispatch(setJamendoSongs(refinedSongs));
        dispatch(setViewingSonglist(refinedSongs));
      } catch (error) {
        setJamendoSongsError(true);
        console.error("Error fetching jamendo songs", error);
      } finally {
        setJamendoSongsLoading(false);
      }
    };
    if (!jamendoSongs) {
      fetchJamendoSongs();
    } else if (!songsList && jamendoSongs) {
      dispatch(setViewingSonglist(jamendoSongs));
    }
  }, [dispatch, jamendoSongs, songsList]);

  return { jamendoSongsLoading, jamendoSongsError };
};

export default useJamendoSongs;
