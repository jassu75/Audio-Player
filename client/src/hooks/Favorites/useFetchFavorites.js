import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  songsSelector,
  userSelector,
} from "../../redux/selectors/homepage.selector";
import axios from "axios";
import { setSongs } from "../../redux/slices/homepage.slice";

const useFetchFavorites = () => {
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState(false);
  const songsList = useSelector(songsSelector);

  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setFavoritesLoading(true);
        setFavoritesError(false);
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
        setFavoritesError(false);
      } finally {
        setFavoritesLoading(false);
      }
    };

    if (!songsList && user) {
      fetchFavorites();
    }
  }, [user, songsList, dispatch]);

  return { favoritesLoading, favoritesError };
};

export default useFetchFavorites;
