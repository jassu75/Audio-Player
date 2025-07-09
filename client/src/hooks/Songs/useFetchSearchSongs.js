import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/homepage.selector";
import { setSongs } from "../../redux/slices/homepage.slice";

const useFetchSearchSongs = (searchText) => {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const [showEmpty, setShowEmpty] = useState(false);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.post(
          "/api/fetchsearchSongs",
          {
            user_id: user.user_id,
            search_text: `%${searchText}%`,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const refinedResponse = response.data?.searchResults?.reduce(
          (acc, song) => {
            acc[song.song_id] = song;
            return acc;
          },
          {}
        );
        if (Object.keys(refinedResponse).length === 0) setShowEmpty(true);
        else setShowEmpty(false);

        dispatch(setSongs(refinedResponse));
        setShowRecentlyPlayed(false);
      } catch (error) {
        console.error("error fetching search songs", error);
      } finally {
      }
    };
    if (searchText && user) {
      const searchTimeoutId = setTimeout(() => {
        fetchSongs();
      }, 300);
      return () => {
        clearTimeout(searchTimeoutId);
      };
    } else {
      setShowRecentlyPlayed(true);
    }
  }, [searchText, user, dispatch]);

  return { showEmpty, showRecentlyPlayed };
};

export default useFetchSearchSongs;
