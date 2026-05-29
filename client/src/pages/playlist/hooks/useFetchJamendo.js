import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jamendoSongslistSelector } from "../../../redux/selectors/homepage.selector";
import { setJamendoSongs } from "../../../redux/slices/homepage.slice";
import { setViewingSonglist } from "../../../redux/slices/audioplayer.slice";

const useFetchJamendo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const jamendoSongslist = useSelector(jamendoSongslistSelector);

  useEffect(() => {
    if (jamendoSongslist) {
      dispatch(setViewingSonglist(jamendoSongslist));
      setLoading(false);
      return;
    }

    const fetchJamendo = async () => {
      try {
        setLoading(true);
        setError(false);
        dispatch(setViewingSonglist(null));
        const response = await axios.get("/api/jamendo/fetchTopSongs");
        const refinedResponse = response.data.results.reduce((acc, song) => {
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
        dispatch(setJamendoSongs(refinedResponse));
        dispatch(setViewingSonglist(refinedResponse));
      } catch (error) {
        setError(true);
        console.error("Error fetching jamendo songs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJamendo();
  }, [dispatch, jamendoSongslist]);

  return { loading, error };
};

export default useFetchJamendo;
