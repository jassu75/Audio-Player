import useFetchFavoriteIds from "../../../pages/favorites/hooks/useFetchFavoriteIds";
import Error from "../../../pages/helpers/error/Error";
import type { RequireFavoritesProps } from "./types/RequireFavorites.types";
const RequireFavorites = ({ children, skeleton = null }: RequireFavoritesProps) => {
    const { favoritesIdLoading: loading, favoritesIdError: error } = useFetchFavoriteIds();
    if (loading)
        return <>{skeleton}</>;
    if (error)
        return <Error />;
    return <>{children}</>;
};
export default RequireFavorites;
