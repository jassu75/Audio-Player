import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { favoritesSelector } from "../../redux/selectors/userPreferences.selector";
import { userSelector } from "../../redux/selectors/homepage.selector";
import { setFavorite } from "../../redux/slices/userPreferences.slice";
import axios from "axios";

const useFetchFavoriteIds = () => {
  const dispatch = useDispatch();
  const [favoritesIdLoading, setFavoritesIdLoading] = useState(false);
  const [favoritesIdError, setFavoritesIdError] = useState(false);
  const favoriteIds = useSelector(favoritesSelector);
  const user = useSelector(userSelector);

  useEffect(() => {
    const fetchFavoriteIds = async () => {
      try {
        setFavoritesIdLoading(true);
        setFavoritesIdError(false);
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
        setFavoritesIdError(false);
      } finally {
        setFavoritesIdLoading(false);
      }
    };

    if (!favoriteIds && user) {
      fetchFavoriteIds();
    }
  }, [dispatch, user, favoriteIds]);

  return { favoritesIdLoading, favoritesIdError };
};

export default useFetchFavoriteIds;
