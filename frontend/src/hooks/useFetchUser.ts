import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userSelector } from "../redux/selectors/homepageSelectors";
import { setUser } from "../redux/slices/homepageSlice";
import { postApi } from "../services/api";
const useFetchUser = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(userSelector);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setFirebaseUser(authUser);
            }
            else {
                navigate("/account", { replace: true });
            }
        });
        return () => unsubscribe();
    }, [navigate]);
    useEffect(() => {
        const fetchUser = async () => {
            if (!firebaseUser)
                return;
            try {
                setLoading(true);
                setError(false);
                const options = { user_id: firebaseUser.uid };
                const response = await postApi("/api/checkExistingUser", options);
                if (!response.data?.users)
                    throw new Error("User profile not found");
                dispatch(setUser(response.data.users));
            }
            catch (error) {
                setError(true);
                console.error("Error fetching user details:", error);
            }
            finally {
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
