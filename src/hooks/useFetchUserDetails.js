import { useQuery } from "@apollo/client";
import { CHECK_EXISTING_USER } from "../queries";
import { useDispatch } from "react-redux";
import { setUser } from "../Songlist/HomepageSongs/homepage.slice";
import { auth } from "../config/firebase";
import { useEffect, useState } from "react";

const useFetchUserDetails = () => {
  const dispatch = useDispatch();

  const [user, setUserState] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );

  const { data, loading } = useQuery(CHECK_EXISTING_USER, {
    variables: { email: auth.currentUser?.email },
    skip: !!user || !auth.currentUser?.email,
    onCompleted: (fetchedData) => {
      if (fetchedData && fetchedData.users.length > 0) {
        const userDetails = fetchedData.users[0];
        setUserState(userDetails);
        localStorage.setItem("user", JSON.stringify(userDetails));
        dispatch(setUser(userDetails));
      }
    },
  });

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  return {
    user: user || (data && data.users.length > 0 ? data.users[0] : "Guest"),
    loading,
  };
};

export default useFetchUserDetails;
