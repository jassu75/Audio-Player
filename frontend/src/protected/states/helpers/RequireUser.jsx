import useFetchUser from "../../../hooks/useFetchUser";
import Error from "../../../pages/helpers/error/Error";

const RequireUser = ({ children, skeleton = null }) => {
  const { loading, error } = useFetchUser();

  if (loading) return skeleton;
  if (error) return <Error />;

  return children;
};

export default RequireUser;
