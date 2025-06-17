import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setJamendoSongs } from "../redux/slices/homepage.slice";
import { jamendoSongsSelector } from "../redux/selectors/homepage.selector";

const useJamendoSongs = () => {
  const [jamendoSongsLoading, setJamendoSongsLoading] = useState(false);
  const [jamendoSongsError, setJamendoSongsError] = useState(false);
  const dispatch = useDispatch();
  const jamendoSongs = useSelector(jamendoSongsSelector);

  useEffect(() => {
    const fetchJamendoSongs = async () => {
      try {
        setJamendoSongsLoading(true);
        const response = await axios.get("/api/jamendo/fetchTopSongs");
        const refinedSongs = response.data.results.map((song) => ({
          id: song.id,
          title: song.name,
          duration: song.duration,
          album: song.name,
          audio_url: song.audio,
          cover_art: song.album_image,
          release_year: song.releasedate.split("-")[0],
          artist: song.artist_name,
        }));
        dispatch(setJamendoSongs(refinedSongs));
      } catch (error) {
        setJamendoSongsError(true);
        console.error("Error fetching jamendo songs", error);
      } finally {
        setJamendoSongsLoading(false);
      }
    };
    if (!jamendoSongs) {
      fetchJamendoSongs();
    }
  }, []);

  return { jamendoSongsLoading, jamendoSongsError };
};

export default useJamendoSongs;
