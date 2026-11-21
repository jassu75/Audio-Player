import { render, screen } from "@testing-library/react";
import { AxiosError } from "axios";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";
import { createTestStore, makeUser } from "../test/fixtures";
import { fetchSessionUser } from "../services/session";
import useFetchUser from "./useFetchUser";

vi.mock("../services/session", () => ({ fetchSessionUser: vi.fn() }));
beforeEach(() => vi.clearAllMocks());

const SessionCheck = () => {
    const { loading, error } = useFetchUser();
    return <span>{error ? "Profile unavailable" : loading ? "Checking session" : "Authenticated"}</span>;
};
const renderSession = () => {
    const store = createTestStore();
    render(<Provider store={store}><MemoryRouter><Routes>
        <Route path="/" element={<SessionCheck />} />
        <Route path="/account" element={<span>Sign in</span>} />
    </Routes></MemoryRouter></Provider>);
    return store;
};

test("refresh restores the profile from the cookie session without Firebase client state", async () => {
    vi.mocked(fetchSessionUser).mockResolvedValueOnce(makeUser());
    const store = renderSession();
    expect(await screen.findByText("Authenticated")).toBeInTheDocument();
    expect(store.getState().homepage.user).toEqual(makeUser());
});

test("an expired session clears cached account data and redirects to sign in", async () => {
    const error = Object.assign(new AxiosError("expired"), { response: { status: 401 } });
    vi.mocked(fetchSessionUser).mockRejectedValueOnce(error);
    sessionStorage.setItem("playlistCollection", "old-account");
    renderSession();
    expect(await screen.findByText("Sign in")).toBeInTheDocument();
    expect(sessionStorage.getItem("playlistCollection")).toBeNull();
});

test("a network error shows a profile error without treating it as a logout", async () => {
    vi.mocked(fetchSessionUser).mockRejectedValueOnce(new Error("offline"));
    renderSession();
    expect(await screen.findByText("Profile unavailable")).toBeInTheDocument();
    expect(screen.queryByText("Sign in")).not.toBeInTheDocument();
});
