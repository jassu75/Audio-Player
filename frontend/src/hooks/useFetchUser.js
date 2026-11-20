import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userSelector } from "../redux/selectors/homepageSelectors.js";
import { setUser } from "../redux/slices/homepageSlice.js";
import { auth } from "../config/firebase";

const useFetchUser = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setFirebaseUser(authUser);
      } else {
        navigate("/account", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(false);
        const options = { user_id: firebaseUser.uid };

        const response = await axios.post("/api/checkExistingUser", options);
        if (!response.data?.users) throw new Error("User profile not found");
        dispatch(setUser(response.data.users));
      } catch (error) {
        setError(true);
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (firebaseUser && user?.user_id !== firebaseUser.uid) {
      fetchUser();
    }
  }, [dispatch, firebaseUser, user]);

  return { loading: loading || (!error && (!firebaseUser || user?.user_id !== firebaseUser.uid)), error };
};

export default useFetchUser;
