import { useQuery } from "@apollo/client";
import { GET_SONGS } from "../queries";
import { useDispatch, useSelector } from "react-redux";
import { setSongs } from "../Songlist/HomepageSongs/homepage.slice";
import { useEffect } from "react";

const useSongHashMap = () => {
  const { data, loading, error } = useQuery(GET_SONGS);
  const dispatch = useDispatch();
  const songsList = useSelector((state) => state.homepage.songs);

  useEffect(() => {
    if (data?.audio_details && Object.keys(songsList).length === 0) {
      const songsHashMap = data.audio_details.reduce((acc, song) => {
        const { id, ...rest } = song;
        acc[id] = rest;
        return acc;
      }, {});

      dispatch(setSongs(songsHashMap));

      localStorage.setItem("songsList", JSON.stringify(songsHashMap));
    }
  }, [data, dispatch, songsList]);

  return { loading, error };
};

export default useSongHashMap;
