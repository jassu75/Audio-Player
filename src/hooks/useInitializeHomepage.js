import { useQuery } from "@apollo/client";
import { GET_SONGS } from "../queries";
import { useDispatch } from "react-redux";
import { setSongs } from "../Songlist/HomepageSongs/homepage.slice";
import { useEffect } from "react";
const useSongHashMap = () => {
  const { data, loading, error } = useQuery(GET_SONGS);
  const dispatch = useDispatch();

  const songsHashMap = data?.audio_details?.reduce((acc, song) => {
    const { id, ...rest } = song;
    acc[id] = rest;
    return acc;
  }, {});

  useEffect(() => {
    if (songsHashMap) {
      dispatch(setSongs(songsHashMap));
    }
  }, [songsHashMap, dispatch]);

  return { songsHashMap, loading, error };
};

export default useSongHashMap;
