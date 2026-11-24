import { act, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import axiosAuth from "../../../config/axiosAuth";
import {
  createTestStore,
  deferred,
  makePlaylist,
  makeUser,
} from "../../../test/fixtures";
import { setUser } from "../../../redux/slices/homepageSlice";
import { PLAYLIST_COLLECTIONS } from "../constants/playlistCollections";
import useFetchPlaylistCollection from "./useFetchPlaylistCollection";
import type { Playlist } from "../../../components/playlist-rail/types/playlist.types";

vi.mock("../../../config/axiosAuth", () => ({
  default: { post: vi.fn(), get: vi.fn() },
}));
const originalConfig = [...PLAYLIST_COLLECTIONS];
const userPlaylist = makePlaylist({ playlist_id: "mine" });
const systemPlaylist = makePlaylist({ playlist_id: "popular" });
const cachedCollections = () => [
  {
    id: "system",
    title: "Old popular title",
    type: "system" as const,
    collection: [systemPlaylist],
  },
  {
    id: "user",
    title: "Old user title",
    type: "user" as const,
    collection: [userPlaylist],
  },
];
const wrap =
  (store: ReturnType<typeof createTestStore>) =>
  ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(axiosAuth.post).mockResolvedValue({
    data: { playlist_details: [userPlaylist] },
  });
  vi.mocked(axiosAuth.get).mockResolvedValue({
    data: { playlist_details: [systemPlaylist] },
  });
});
afterEach(() => {
  PLAYLIST_COLLECTIONS.splice(
    0,
    PLAYLIST_COLLECTIONS.length,
    ...originalConfig,
  );
});

test("old two-rail caches gain the configured For You rail without refetching cached collections", async () => {
  const store = createTestStore({
    homepage: { user: makeUser(), playlistCollection: cachedCollections() },
  });
  const { result } = renderHook(useFetchPlaylistCollection, {
    wrapper: wrap(store),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  const collections = store.getState().homepage.playlistCollection;
  expect(collections?.map((collection) => collection.title)).toEqual([
    "For You",
    "Your Playlists",
    "Popular Playlists",
  ]);
  expect(
    collections?.[0].collection.map((playlist) => playlist.playlist_title),
  ).toEqual(["Favorites", "Recently Played", "Most Listened"]);
  expect(collections?.[1].collection).toEqual([userPlaylist]);
  expect(collections?.[2].collection).toEqual([systemPlaylist]);
  expect(axiosAuth.post).not.toHaveBeenCalled();
  expect(axiosAuth.get).not.toHaveBeenCalled();
});

test("a fresh load uses each configured loader and stores only serializable playlist collections", async () => {
  const store = createTestStore({
    homepage: { user: makeUser(), playlistCollection: null },
  });
  const { result } = renderHook(useFetchPlaylistCollection, {
    wrapper: wrap(store),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(axiosAuth.post).toHaveBeenCalledWith(
    "/api/getPlaylists",
    { user_id: "u1" },
    { signal: expect.any(AbortSignal) },
  );
  expect(axiosAuth.get).toHaveBeenCalledWith("/api/fetch-system-playlists", {
    signal: expect.any(AbortSignal),
  });
  const collections = store.getState().homepage.playlistCollection;
  expect(collections?.map((collection) => collection.id)).toEqual([
    "for-you",
    "user",
    "system",
  ]);
  expect(collections?.[0].collection[0].path).toBe("/favorites");
  expect(collections?.[1].collection).toEqual([userPlaylist]);
  expect(collections?.[2].collection).toEqual([systemPlaylist]);
  expect(
    JSON.parse(sessionStorage.getItem("playlistCollection") ?? "null"),
  ).toEqual(collections);
  expect(
    collections?.every(
      (collection) =>
        !("loadPlaylists" in collection) && !("cache" in collection),
    ),
  ).toBe(true);
});

test("the config controls rail ordering independently of cache order", async () => {
  PLAYLIST_COLLECTIONS.splice(
    0,
    PLAYLIST_COLLECTIONS.length,
    originalConfig[2],
    originalConfig[0],
    originalConfig[1],
  );
  const store = createTestStore({
    homepage: { user: makeUser(), playlistCollection: cachedCollections() },
  });
  const { result } = renderHook(useFetchPlaylistCollection, {
    wrapper: wrap(store),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(
    store
      .getState()
      .homepage.playlistCollection?.map((collection) => collection.id),
  ).toEqual(["system", "for-you", "user"]);
});

test("removing a config entry removes its cached rail", async () => {
  PLAYLIST_COLLECTIONS.splice(0, 1);
  const forYou = originalConfig[0];
  const store = createTestStore({
    homepage: {
      user: makeUser(),
      playlistCollection: [
        {
          id: forYou.id,
          title: forYou.title,
          type: forYou.type,
          collection: [],
        },
        ...cachedCollections(),
      ],
    },
  });
  const { result } = renderHook(useFetchPlaylistCollection, {
    wrapper: wrap(store),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(
    store
      .getState()
      .homepage.playlistCollection?.map((collection) => collection.id),
  ).toEqual(["user", "system"]);
});

test("an obsolete request is cancelled and cannot replace state after leaving the page", async () => {
  const pending = deferred<{ data: { playlist_details: Playlist[] } }>();
  vi.mocked(axiosAuth.post).mockReturnValueOnce(
    pending.promise as ReturnType<typeof axiosAuth.post>,
  );
  const store = createTestStore({
    homepage: { user: makeUser(), playlistCollection: null },
  });
  const { unmount } = renderHook(useFetchPlaylistCollection, {
    wrapper: wrap(store),
  });
  const signal = vi.mocked(axiosAuth.post).mock.calls[0][2]?.signal;
  unmount();
  expect(signal?.aborted).toBe(true);
  await act(async () =>
    pending.resolve({ data: { playlist_details: [userPlaylist] } }),
  );
  expect(store.getState().homepage.playlistCollection).toBeNull();
});

test("a failed loader reports an error without publishing partial rails", async () => {
  vi.mocked(axiosAuth.post).mockRejectedValueOnce(new Error("offline"));
  const store = createTestStore({
    homepage: { user: makeUser(), playlistCollection: null },
  });
  const { result } = renderHook(useFetchPlaylistCollection, {
    wrapper: wrap(store),
  });
  await waitFor(() => expect(result.current.error).toBe(true));
  expect(result.current.loading).toBe(false);
  expect(store.getState().homepage.playlistCollection).toBeNull();
});

test("loaders wait for the authenticated user", async () => {
  const store = createTestStore({
    homepage: { user: null, playlistCollection: null },
  });
  const { result } = renderHook(useFetchPlaylistCollection, {
    wrapper: wrap(store),
  });
  expect(result.current.loading).toBe(true);
  expect(axiosAuth.post).not.toHaveBeenCalled();
  expect(axiosAuth.get).not.toHaveBeenCalled();
  act(() => {
    store.dispatch(setUser(makeUser()));
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(axiosAuth.post).toHaveBeenCalledTimes(1);
});
