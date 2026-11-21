import axios from "axios";
import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../config/firebase";
import type { UserProfile } from "../hooks/types/useFetchUser.types";
import { postApi } from "./api";
import store from "../redux/store";
import { resetSessionState } from "../redux/rootReducer";

export const removeLegacyUser = () => {
    try { localStorage.removeItem("user"); }
    catch { return; }
};

export const createUserSession = async (user: User) => {
    try {
        const response = await postApi("/api/auth/session", { idToken: await user.getIdToken() });
        sessionStorage.clear();
        store.dispatch(resetSessionState());
        removeLegacyUser();
        return response.data.users;
    } finally {
        await signOut(auth);
    }
};

export const fetchSessionUser = async (signal?: AbortSignal) => {
    const response = await axios.get<{ users: UserProfile }>("/api/auth/session", { withCredentials: true, signal });
    return response.data.users;
};

export const endUserSession = async () => {
    await postApi("/api/auth/logout", {});
    await signOut(auth);
    sessionStorage.clear();
    store.dispatch(resetSessionState());
    removeLegacyUser();
};
