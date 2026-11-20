import useFetchFavoriteIds from "../../../pages/favorites/hooks/useFetchFavoriteIds";
import Error from "../../../pages/helpers/error/Error";

const RequireFavorites = ({ children, skeleton = null }) => {
  const { favoritesIdLoading: loading, favoritesIdError: error } = useFetchFavoriteIds();

  if (loading) return skeleton;
  if (error) return <Error />;

  return children;
};

export default RequireFavorites;
