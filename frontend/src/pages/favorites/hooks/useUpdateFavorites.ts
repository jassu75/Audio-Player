import { useAppDispatch, useAppStore } from "../../../redux/hooks";
import { userSelector } from "../../../redux/selectors/homepageSelectors";
import { addFavorite, deleteFavorite, startFavoriteUpdate, finishFavoriteUpdate } from "../../../redux/slices/userPreferencesSlice";
import { postApi } from "../../../services/api";

const useUpdateFavorites = () => {
    const dispatch = useAppDispatch();
    const store = useAppStore();
    const toggleFavorite = async (songId: string) => {
        const state = store.getState();
        const user = userSelector(state);
        if (!user) throw new Error("Sign in to update favorites");
        const existing = state.userPrefs.favoriteUpdates[songId];
        const isFavorite = !(existing?.isFavorite ?? state.userPrefs.favorites?.includes(songId) ?? false);
        if (existing?.pending) {
            dispatch(startFavoriteUpdate({ songId, requestId: existing.requestId, isFavorite }));
            return;
        }
        const requestId = crypto.randomUUID();
        dispatch(startFavoriteUpdate({ songId, requestId, isFavorite }));
        const isCurrentRequest = () => userSelector(store.getState())?.user_id === user.user_id
            && store.getState().userPrefs.favoriteUpdates[songId]?.requestId === requestId;
        let confirmed = state.userPrefs.favorites?.includes(songId) ?? false;
        while (isCurrentRequest()) {
            const desired = store.getState().userPrefs.favoriteUpdates[songId]?.isFavorite;
            if (desired === undefined) return;
            try {
                await postApi(desired ? "/api/addfavorite" : "/api/deletefavorite", {
                    user_id: user.user_id,
                    favorite_id: songId,
                });
                confirmed = desired;
            } catch (error) {
                if (!isCurrentRequest()) return;
                if (store.getState().userPrefs.favoriteUpdates[songId]?.isFavorite !== desired) continue;
                dispatch(confirmed ? addFavorite(songId) : deleteFavorite(songId));
                dispatch(finishFavoriteUpdate({ songId, requestId, error: "Unable to update favorite. Please try again." }));
                throw error;
            }
            if (!isCurrentRequest()) return;
            if (store.getState().userPrefs.favoriteUpdates[songId]?.isFavorite !== desired) continue;
            dispatch(desired ? addFavorite(songId) : deleteFavorite(songId));
            dispatch(finishFavoriteUpdate({ songId, requestId }));
            return;
        }
    };
    return { toggleFavorite };
};

export default useUpdateFavorites;
