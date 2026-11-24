import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";
import { createUserSession } from "../../../services/session";
import { postApi } from "../../../services/api";
import SignIn from "./SignIn";

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("../../../config/firebase", () => ({
  auth: {},
  authReady: Promise.resolve(),
  googleAuthProvider: {},
}));
vi.mock("../../../services/session", () => ({ createUserSession: vi.fn() }));
vi.mock("../../../services/api", () => ({ postApi: vi.fn() }));
beforeEach(() => vi.clearAllMocks());

const renderSignIn = () =>
  render(
    <MemoryRouter initialEntries={["/account"]}>
      <Routes>
        <Route path="/account" element={<SignIn />} />
        <Route path="/" element={<span>Your library</span>} />
      </Routes>
    </MemoryRouter>,
  );
const submit = () => {
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "listener@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "test-password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
};

test("email login waits for the server session before opening the library", async () => {
  const user = { uid: "u1", emailVerified: true };
  vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce({
    user,
  } as Awaited<ReturnType<typeof signInWithEmailAndPassword>>);
  renderSignIn();
  submit();
  expect(await screen.findByText("Your library")).toBeInTheDocument();
  expect(createUserSession).toHaveBeenCalledWith(user);
});

test("unverified email login cannot create a session", async () => {
  const user = { uid: "u1", emailVerified: false };
  vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce({
    user,
  } as Awaited<ReturnType<typeof signInWithEmailAndPassword>>);
  renderSignIn();
  submit();
  expect(
    await screen.findByText("Please verify your email and then log in."),
  ).toBeInTheDocument();
  expect(createUserSession).not.toHaveBeenCalled();
  expect(signOut).toHaveBeenCalled();
});

test("new Google accounts register with their temporary token before exchanging it for a session", async () => {
  const user = {
    uid: "u1",
    email: "listener@example.com",
    displayName: "Listener",
    getIdToken: vi.fn().mockResolvedValue("google-id-token"),
  };
  vi.mocked(signInWithPopup).mockResolvedValueOnce({
    user,
  } as unknown as Awaited<ReturnType<typeof signInWithPopup>>);
  vi.mocked(postApi)
    .mockResolvedValueOnce({ data: { users: [] } } as Awaited<
      ReturnType<typeof postApi>
    >)
    .mockResolvedValueOnce({} as Awaited<ReturnType<typeof postApi>>);
  renderSignIn();
  fireEvent.click(screen.getByRole("button", { name: "Google Sign-In" }));
  await waitFor(() => expect(createUserSession).toHaveBeenCalledWith(user));
  expect(postApi).toHaveBeenCalledWith(
    "/api/addUser",
    {
      newUser: {
        user_id: "u1",
        email_id: "listener@example.com",
        username: "Listener",
        sign_in_method: "google",
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer google-id-token",
      },
    },
  );
  expect(await screen.findByText("Your library")).toBeInTheDocument();
});
