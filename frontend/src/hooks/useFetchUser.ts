import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userSelector } from "../redux/selectors/homepageSelectors";
import { setUser } from "../redux/slices/homepageSlice";
import { fetchSessionUser } from "../services/session";
import { resetSessionState } from "../redux/rootReducer";

const useFetchUser = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(userSelector);
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    useEffect(() => {
        if (user) return;
        const controller = new AbortController();
        setError(false);
        fetchSessionUser(controller.signal).then(profile => {
            if (!controller.signal.aborted) dispatch(setUser(profile));
        }).catch((reason: unknown) => {
            if (controller.signal.aborted) return;
            if (axios.isAxiosError(reason) && reason.response?.status === 401) {
                sessionStorage.clear();
                dispatch(resetSessionState());
                navigate("/account", { replace: true });
            } else {
                setError(true);
            }
        });
        return () => controller.abort();
    }, [dispatch, navigate, user]);
    return { loading: !user && !error, error };
};

export default useFetchUser;
