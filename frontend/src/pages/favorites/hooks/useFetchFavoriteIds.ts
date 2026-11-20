import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { userSelector } from "../../../redux/selectors/homepageSelectors";
import { favoritesSelector } from "../../../redux/selectors/userPreferencesSelectors";
import { setFavorites } from "../../../redux/slices/userPreferencesSlice";
import { postApi } from "../../../services/api";
const useFetchFavoriteIds = () => {
    const dispatch = useAppDispatch();
    const [favoritesIdLoading, setFavoritesIdLoading] = useState(false);
    const [favoritesIdError, setFavoritesIdError] = useState(false);
    const favoriteIds = useAppSelector(favoritesSelector);
    const user = useAppSelector(userSelector);
    useEffect(() => {
        let active = true;
        const fetchFavoriteIds = async () => {
            if (!user)
                return;
            try {
                setFavoritesIdLoading(true);
                setFavoritesIdError(false);
                const response = await postApi("/api/fetchfavoriteids", { user_id: user.user_id }, {
                    headers: { "Content-Type": "application/json" },
                });
                const refinedResponse = response.data?.favoriteIds?.map((favorite) => favorite.favorite_id);
                if (active)
                    dispatch(setFavorites(refinedResponse ?? []));
            }
            catch (error) {
                console.error("error fetching favoriteIds", error);
                if (active)
                    setFavoritesIdError(true);
            }
            finally {
                if (active)
                    setFavoritesIdLoading(false);
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
