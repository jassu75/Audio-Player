import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userSelector } from "../redux/selectors/homepage.selector";
import { setUser } from "../redux/slices/homepage.slice";
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
        dispatch(setUser(response.data?.users));
      } catch (error) {
        setError(true);
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!user && firebaseUser) {
      fetchUser();
    }
  }, [dispatch, firebaseUser, user]);

  return { loading, error };
};

export default useFetchUser;
