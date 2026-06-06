import Error from "../../../pages/helpers/error/Error";
import useFetchPlaylistCollection from "../../../pages/homepage/hooks/useFetchPlaylistCollection";

const RequirePlaylistCollection = ({ children, skeleton = null }) => {
  const { loading, error } = useFetchPlaylistCollection();

  if (loading) return skeleton;
  if (error) return <Error />;

  return children;
};

export default RequirePlaylistCollection;
