import useFetchUser from "../../../hooks/useFetchUser";
import Error from "../../../pages/helpers/error/Error";
import type { RequireUserProps } from "./types/RequireUser.types";
const RequireUser = ({ children, skeleton = null }: RequireUserProps) => {
  const { loading, error } = useFetchUser();
  if (loading) return <>{skeleton}</>;
  if (error) return <Error />;
  return <>{children}</>;
};
export default RequireUser;
