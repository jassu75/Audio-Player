import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../Songlist/HomepageSongs/homepage.slice";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useEffect } from "react";

const useFetchUserDetails = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.homepage.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!user && firebaseUser?.email) {
        try {
          const data = { email: firebaseUser?.email };
          const headers = {
            "Content-Type": "application/json",
          };
          const axiosOptions = {
            headers: headers,
          };
          const response = await axios.post(
            "/api/checkExistingUser",
            data,
            axiosOptions
          );

          if (response.data?.users?.length > 0) {
            const userDetails = response.data.users[0];
            dispatch(setUser(userDetails));
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch, user]);
};

export default useFetchUserDetails;
