import { useDispatch, useSelector } from "react-redux";
import { setSongs } from "../Songlist/HomepageSongs/homepage.slice";
import { useEffect, useState } from "react";
import axios from "axios";

const useHomepageSongs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const songsList = useSelector((state) => state.homepage.songs);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError(false);
        const url = "/api/getSongs";
        const response = await axios.get(url);
        if (
          response.data?.audio_details &&
          Object.keys(songsList).length === 0
        ) {
          const songsHashMap = response.data.audio_details.reduce(
            (acc, song) => {
              const { title, ...rest } = song;
              acc[title] = rest;
              return acc;
            },
            {}
          );

          dispatch(setSongs(songsHashMap));

          localStorage.setItem("songsList", JSON.stringify(songsHashMap));
        }
      } catch (error) {
        setError(true);
        console.error("Error fetching songs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [dispatch]);

  return { loading, error };
};

export default useHomepageSongs;
