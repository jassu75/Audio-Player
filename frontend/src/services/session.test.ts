import axios from "axios";
import { signOut } from "firebase/auth";
import { beforeEach, expect, test, vi } from "vitest";
import { auth } from "../config/firebase";
import { createTestStore, makeUser } from "../test/fixtures";
import { setUser } from "../redux/slices/homepageSlice";
import { createUserSession, endUserSession, fetchSessionUser, removeLegacyUser } from "./session";
import type { User } from "firebase/auth";

vi.mock("axios", () => ({ default: { post: vi.fn(), get: vi.fn() } }));
vi.mock("firebase/auth", () => ({ signOut: vi.fn() }));
vi.mock("../config/firebase", () => ({ auth: {} }));
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); vi.clearAllMocks(); });

test("profiles stay in memory and legacy local-storage users are discarded", () => {
    localStorage.setItem("user", JSON.stringify({ data: makeUser({ user_id: "forged" }), timestamp: Date.now() }));
    const store = createTestStore();
    expect(store.getState().homepage.user).toBeNull();
    removeLegacyUser();
    store.dispatch(setUser(makeUser()));
    expect(store.getState().homepage.user).toEqual(makeUser());
    expect(localStorage.getItem("user")).toBeNull();
    expect(sessionStorage.getItem("user")).toBeNull();
});

test("login exchanges the temporary ID token and clears browser authentication and old caches", async () => {
    const user = { getIdToken: vi.fn().mockResolvedValue("temporary-token") } as unknown as User;
    vi.mocked(axios.post).mockResolvedValue({ data: { users: makeUser() } });
    sessionStorage.setItem("playlistCollection", "previous-account");
    expect(await createUserSession(user)).toEqual(makeUser());
    expect(axios.post).toHaveBeenCalledWith("/api/auth/session", { idToken: "temporary-token" }, {
        withCredentials: true, headers: { "X-Musify-Request": "1" },
    });
    expect(signOut).toHaveBeenCalledWith(auth);
    expect(sessionStorage.getItem("playlistCollection")).toBeNull();
    expect(localStorage.length).toBe(0);
});

test("failed session creation still signs out the temporary Firebase user", async () => {
    const user = { getIdToken: vi.fn().mockResolvedValue("temporary-token") } as unknown as User;
    vi.mocked(axios.post).mockRejectedValueOnce(new Error("rejected"));
    await expect(createUserSession(user)).rejects.toThrow("rejected");
    expect(signOut).toHaveBeenCalledWith(auth);
});

test("restoring a session requests the server profile with credentials", async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: { users: makeUser() } });
    expect(await fetchSessionUser()).toEqual(makeUser());
    expect(axios.get).toHaveBeenCalledWith("/api/auth/session", { withCredentials: true, signal: undefined });
});

test("logout clears the server session before discarding account caches", async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({});
    localStorage.setItem("user", "old-profile");
    sessionStorage.setItem("playlistCollection", "old-library");
    await endUserSession();
    expect(axios.post).toHaveBeenCalledWith("/api/auth/logout", {}, expect.objectContaining({ withCredentials: true }));
    expect(signOut).toHaveBeenCalledWith(auth);
    expect(localStorage.getItem("user")).toBeNull();
    expect(sessionStorage.length).toBe(0);
});
