import React, { act } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import homepage from "../../../redux/slices/homepageSlice";
import audioplayer from "../../../redux/slices/audioPlayerSlice";
import userPrefs from "../../../redux/slices/userPreferencesSlice";
import useFetchFavorites from "./useFetchFavorites";
import useFetchFavoriteIds from "./useFetchFavoriteIds";
import FavoriteIcon from "../../../components/favorites/favorite-icon/FavoriteIcon";

jest.mock("axios", () => ({ post: jest.fn() }));

const makeStore = (favorites = []) => configureStore({
  reducer: { homepage, audioplayer, userPrefs },
  preloadedState: {
    homepage: { user: { user_id: "u1" }, playlistCollection: [] },
    audioplayer: { viewingSongList: { old: { song_id: "old", title: "Previous playlist" } }, playingSongList: null, playingIndex: null },
    userPrefs: { favorites, recentlyPlayed: [], listens: {} },
  },
});
const wrap = (store) => ({ children }) => <Provider store={store}>{children}</Provider>;

afterEach(() => jest.restoreAllMocks());

test("Favorites fetches its own songs even when another page already populated the list", async () => {
  axios.post.mockResolvedValueOnce({ data: { favorites: [{ song: { song_id: "favorite", title: "Favorite" } }] } });
  const store = makeStore();
  const { result } = renderHook(useFetchFavorites, { wrapper: wrap(store) });
  await waitFor(() => expect(result.current.favoritesLoading).toBe(false));
  expect(store.getState().audioplayer.viewingSongList).toEqual({ favorite: { song_id: "favorite", title: "Favorite" } });
});

test("Favorites surfaces a failed request instead of loading forever", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  axios.post.mockRejectedValueOnce(new Error("offline"));
  const { result } = renderHook(useFetchFavorites, { wrapper: wrap(makeStore()) });
  await waitFor(() => expect(result.current.favoritesError).toBe(true));
  expect(result.current.favoritesLoading).toBe(false);
});

test("favorite ID request errors reach the route guard", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  axios.post.mockRejectedValueOnce(new Error("offline"));
  const { result } = renderHook(useFetchFavoriteIds, { wrapper: wrap(makeStore(null)) });
  await waitFor(() => expect(result.current.favoritesIdError).toBe(true));
  expect(result.current.favoritesIdLoading).toBe(false);
});

test("failed favorite updates leave both copies unchanged and allow retry", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  axios.post.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({});
  const store = makeStore();
  render(<Provider store={store}><FavoriteIcon songId="s1" /><FavoriteIcon songId="s1" /></Provider>);
  fireEvent.click(screen.getAllByRole("button", { name: "Add to favorites" })[0]);
  await waitFor(() => expect(screen.getAllByRole("button", { name: "Add to favorites" })[0]).toBeEnabled());
  expect(store.getState().userPrefs.favorites).toEqual([]);
  fireEvent.click(screen.getAllByRole("button", { name: "Add to favorites" })[0]);
  await screen.findAllByRole("button", { name: "Remove from favorites" });
  expect(store.getState().userPrefs.favorites).toEqual(["s1"]);
});

test("a late Favorites response cannot overwrite another page", async () => {
  let resolve;
  axios.post.mockReturnValueOnce(new Promise((done) => { resolve = done; }));
  const store = makeStore();
  const { unmount } = renderHook(useFetchFavorites, { wrapper: wrap(store) });
  unmount();
  await act(async () => resolve({ data: { favorites: [{ song: { song_id: "stale" } }] } }));
  expect(store.getState().audioplayer.viewingSongList).toBeNull();
});
