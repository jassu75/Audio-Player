import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  songsSelector,
  userSelector,
} from "../../redux/selectors/homepage.selector";
import axios from "axios";
import { setSongs } from "../../redux/slices/homepage.slice";

const useFetchPreferenceSongs = (preference) => {
  const [songsLoading, setSongsLoading] = useState(false);
  const [songsError, setSongsError] = useState(false);
  const user = useSelector(userSelector);
  const songsList = useSelector(songsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setSongsLoading(true);
        setSongsError(false);
        const response = await axios.post(
          "/api/fetchfavorites",
          { user_id: user.user_id },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const refinedResponse = response.data?.favorites?.reduce(
          (acc, favorite) => {
            acc[favorite.song.song_id] = favorite.song;

            return acc;
          },
          {}
        );
        dispatch(setSongs(refinedResponse));
        sessionStorage.setItem("favorites", JSON.stringify(refinedResponse));
      } catch (error) {
        console.error("error fetching favoriteIds", error);
        setSongsError(false);
      } finally {
        setSongsLoading(false);
      }
    };

    if (!songsList && user && preference === "favorites") {
      fetchFavorites();
    }
  }, [user, songsList, dispatch, preference]);

  return { songsLoading, songsError };
};

export default useFetchPreferenceSongs;
