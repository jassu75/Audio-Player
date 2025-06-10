import { useDispatch, useSelector } from "react-redux";
import { setPlaylistDetails } from "../Songlist/HomepageSongs/homepage.slice";
import { useEffect, useState } from "react";
import axios from "axios";

const useHomepagePlaylists = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const playlistSongs = useSelector((state) => state.homepage.playlists);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        setError(false);
        const url = "/api/getPlaylists";
        const response = await axios.get(url);
        if (
          response.data?.playlist_details &&
          Object.keys(playlistSongs).length === 0
        ) {
          const playlistHashMap = response.data.playlist_details.reduce(
            (acc, song) => {
              const { id, ...rest } = song;
              acc[id] = rest;
              return acc;
            },
            {}
          );

          dispatch(setPlaylistDetails(playlistHashMap));
        }
      } catch (error) {
        setError(true);
        console.error("Error fetching songs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, [dispatch]);

  return { loading, error };
};

export default useHomepagePlaylists;
