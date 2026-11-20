import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../../redux/selectors/homepageSelectors.js";
import { setViewingSongList } from "../../../redux/slices/audioPlayerSlice.js";
import { indexSongs } from "../../../utils/songs";

const useFetchSearchSongs = (searchText) => {
  const userId = useSelector(userSelector)?.user_id;
  const dispatch = useDispatch();
  const [showEmpty, setShowEmpty] = useState(false);
  const [error, setError] = useState(false);
  const showRecentlyPlayed = !searchText.trim();

  useEffect(() => {
    let active = true;
    setError(false);
    setShowEmpty(false);
    if (showRecentlyPlayed || !userId) return;
    dispatch(setViewingSongList(null));

    const timeoutId = setTimeout(async () => {
      try {
        const response = await axios.post("/api/fetchsearchsongs", {
          user_id: userId,
          search_text: "%" + searchText.trim() + "%",
        });
        if (!active) return;
        const songs = indexSongs(response.data?.searchResults ?? []);
        dispatch(setViewingSongList(songs));
        setShowEmpty(Object.keys(songs).length === 0);
      } catch (error) {
        if (active) setError(true);
        console.error("Error fetching search songs", error);
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [searchText, showRecentlyPlayed, userId, dispatch]);

  return { showEmpty, showRecentlyPlayed, error };
};

export default useFetchSearchSongs;
