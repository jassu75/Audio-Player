import Error from "../../../pages/helpers/error/Error";
import useFetchPlaylistCollection from "../../../pages/homepage/hooks/useFetchPlaylistCollection";
import type { RequirePlaylistCollectionProps } from "./types/RequirePlaylistCollection.types";
const RequirePlaylistCollection = ({
  children,
  skeleton = null,
}: RequirePlaylistCollectionProps) => {
  const { loading, error } = useFetchPlaylistCollection();
  if (loading) return <>{skeleton}</>;
  if (error) return <Error />;
  return <>{children}</>;
};
export default RequirePlaylistCollection;
