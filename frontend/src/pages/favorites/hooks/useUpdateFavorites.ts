import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { userSelector } from "../../../redux/selectors/homepageSelectors";
import { addFavorite, deleteFavorite, } from "../../../redux/slices/userPreferencesSlice";
import { postApi } from "../../../services/api";
const useUpdateFavorites = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(userSelector);
    const addFavoriteId = async (songId: string) => {
        if (!user)
            throw new Error("Sign in to update favorites");
        try {
            await postApi("/api/addfavorite", {
                user_id: user.user_id,
                favorite_id: songId,
            }, {
                headers: { "Content-Type": "application/json" },
            });
            dispatch(addFavorite(songId));
        }
        catch (error) {
            console.error("Error adding favorite", error);
            throw error;
        }
    };
    const deleteFavoriteId = async (songId: string) => {
        if (!user)
            throw new Error("Sign in to update favorites");
        try {
            await postApi("/api/deletefavorite", {
                user_id: user.user_id,
                favorite_id: songId,
            }, {
                headers: { "Content-Type": "application/json" },
            });
            dispatch(deleteFavorite(songId));
        }
        catch (error) {
            console.error("Error deleting favorite", error);
            throw error;
        }
    };
    return { addFavoriteId, deleteFavoriteId };
};
export default useUpdateFavorites;
