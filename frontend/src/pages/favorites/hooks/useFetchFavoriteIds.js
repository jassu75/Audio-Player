import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { favoritesSelector } from "../../../redux/selectors/userPreferencesSelectors.js";
import { userSelector } from "../../../redux/selectors/homepageSelectors.js";
import { setFavorites } from "../../../redux/slices/userPreferencesSlice.js";
import axios from "axios";

const useFetchFavoriteIds = () => {
  const dispatch = useDispatch();
  const [favoritesIdLoading, setFavoritesIdLoading] = useState(false);
  const [favoritesIdError, setFavoritesIdError] = useState(false);
  const favoriteIds = useSelector(favoritesSelector);
  const user = useSelector(userSelector);

  useEffect(() => {
    let active = true;
    const fetchFavoriteIds = async () => {
      try {
        setFavoritesIdLoading(true);
        setFavoritesIdError(false);
        const response = await axios.post(
          "/api/fetchfavoriteids",
          { user_id: user.user_id },
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        const refinedResponse = response.data?.favoriteIds?.map(
          (favorite) => favorite.favorite_id,
        );
        if (active) dispatch(setFavorites(refinedResponse ?? []));
      } catch (error) {
        console.error("error fetching favoriteIds", error);
        if (active) setFavoritesIdError(true);
      } finally {
        if (active) setFavoritesIdLoading(false);
      }
    };

    if (!favoriteIds && user) {
      fetchFavoriteIds();
    }
    return () => { active = false; };
  }, [dispatch, user, favoriteIds]);

  return { favoritesIdLoading: favoritesIdLoading || (!favoriteIds && !favoritesIdError), favoritesIdError };
};

export default useFetchFavoriteIds;
