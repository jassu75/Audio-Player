import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { favoritesSelector } from "../../redux/selectors/userPreferences.selector";
import { userSelector } from "../../redux/selectors/homepage.selector";
import { setFavorite } from "../../redux/slices/userPreferences.slice";
import axios from "axios";

const useFetchFavoriteIds = () => {
  const dispatch = useDispatch();
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState(false);
  const favoriteIds = useSelector(favoritesSelector);
  const user = useSelector(userSelector);

  useEffect(() => {
    const fetchFavoriteIds = async () => {
      try {
        setFavoritesLoading(true);
        setFavoritesError(false);
        const response = await axios.post(
          "/api/fetchfavoriteids",
          { user_id: user.user_id },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const refinedResponse = response.data?.favoriteIds?.map(
          (favorite) => favorite.favorite_id
        );
        dispatch(setFavorite(refinedResponse));
      } catch (error) {
        console.error("error fetching favoriteIds", error);
        setFavoritesError(false);
      } finally {
        setFavoritesLoading(false);
      }
    };

    if (!favoriteIds && user) {
      fetchFavoriteIds();
    }
  }, [dispatch, user, favoriteIds]);

  return { favoritesLoading, favoritesError };
};

export default useFetchFavoriteIds;
