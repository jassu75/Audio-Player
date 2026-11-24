import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import axios from "axios";
import React, { act } from "react";
import { Provider } from "react-redux";
import { afterEach, expect, test, vi } from "vitest";
import FavoriteIcon from "../../../components/favorites/favorite-icon/FavoriteIcon";
import {
  createTestStore,
  deferred,
  makeSong,
  makeUser,
} from "../../../test/fixtures";
import type { Song } from "../../../components/playlist/playlist-songs-list/playlist-song/types/song.types";
import useFetchFavoriteIds from "./useFetchFavoriteIds";
import useFetchFavorites from "./useFetchFavorites";
import { MemoryRouter } from "react-router-dom";
import Favorites from "../Favorites";
import { resetSessionState } from "../../../redux/rootReducer";
import { addRecentlyPlayed } from "../../../redux/slices/userPreferencesSlice";
vi.mock("axios", () => ({ default: { post: vi.fn() } }));
const makeStore = (favorites: string[] | null = []) =>
  createTestStore({
    homepage: { user: makeUser(), playlistCollection: [] },
    audioplayer: {
      viewingSongList: {
        old: makeSong({ song_id: "old", title: "Previous playlist" }),
      },
      playingSongList: null,
      playingIndex: null,
    },
    userPrefs: { favorites, recentlyPlayed: [], listens: {} },
  });
const wrap =
  (store: ReturnType<typeof makeStore>) =>
  ({ children }: React.PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );
afterEach(() => vi.restoreAllMocks());
test("Favorites fetches its own songs even when another page already populated the list", async () => {
  vi.mocked(axios.post).mockResolvedValueOnce({
    data: { favorites: [{ song: { song_id: "favorite", title: "Favorite" } }] },
  });
  const store = makeStore();
  const { result } = renderHook(useFetchFavorites, { wrapper: wrap(store) });
  await waitFor(() => expect(result.current.favoritesLoading).toBe(false));
  expect(store.getState().audioplayer.viewingSongList).toEqual({
    favorite: { song_id: "favorite", title: "Favorite" },
  });
});
test("Favorites surfaces a failed request instead of loading forever", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(axios.post).mockRejectedValueOnce(new Error("offline"));
  const { result } = renderHook(useFetchFavorites, {
    wrapper: wrap(makeStore()),
  });
  await waitFor(() => expect(result.current.favoritesError).toBe(true));
  expect(result.current.favoritesLoading).toBe(false);
});
test("favorite ID request errors reach the route guard", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(axios.post).mockRejectedValueOnce(new Error("offline"));
  const { result } = renderHook(useFetchFavoriteIds, {
    wrapper: wrap(makeStore(null)),
  });
  await waitFor(() => expect(result.current.favoritesIdError).toBe(true));
  expect(result.current.favoritesIdLoading).toBe(false);
});
test("failed favorite updates leave both copies unchanged and allow retry", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(axios.post)
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce({});
  const store = makeStore();
  render(
    <Provider store={store}>
      <FavoriteIcon songId="s1" />
      <FavoriteIcon songId="s1" />
    </Provider>,
  );
  fireEvent.click(
    screen.getAllByRole("button", { name: "Add to favorites" })[0],
  );
  await waitFor(() =>
    expect(
      screen.getAllByRole("button", { name: "Add to favorites" })[0],
    ).toBeEnabled(),
  );
  expect(store.getState().userPrefs.favorites).toEqual([]);
  fireEvent.click(
    screen.getAllByRole("button", { name: "Add to favorites" })[0],
  );
  await screen.findAllByRole("button", { name: "Remove from favorites" });
  expect(store.getState().userPrefs.favorites).toEqual(["s1"]);
});
test("a late Favorites response cannot overwrite another page", async () => {
  const { promise, resolve } = deferred<{
    data: {
      favorites: {
        song: Song;
      }[];
    };
  }>();
  vi.mocked(axios.post).mockReturnValueOnce(promise);
  const store = makeStore();
  const { unmount } = renderHook(useFetchFavorites, { wrapper: wrap(store) });
  unmount();
  await act(async () =>
    resolve({
      data: { favorites: [{ song: makeSong({ song_id: "stale" }) }] },
    }),
  );
  expect(store.getState().audioplayer.viewingSongList).toBeNull();
});

test("every click changes all copies of the heart immediately while saves are pending", async () => {
  const pending = deferred<unknown>();
  vi.mocked(axios.post).mockReturnValueOnce(pending.promise);
  const store = makeStore();
  render(
    <Provider store={store}>
      <FavoriteIcon songId="s1" />
      <FavoriteIcon songId="s1" />
    </Provider>,
  );
  fireEvent.click(
    screen.getAllByRole("button", { name: "Add to favorites" })[0],
  );
  const hearts = screen.getAllByRole("button", {
    name: "Remove from favorites",
  });
  expect(hearts).toHaveLength(2);
  for (const heart of hearts) {
    expect(heart).toHaveAttribute("aria-pressed", "true");
    expect(heart).toHaveAttribute("aria-busy", "true");
  }
  fireEvent.click(hearts[0]);
  expect(
    screen.getAllByRole("button", { name: "Add to favorites" }),
  ).toHaveLength(2);
  expect(screen.queryAllByTestId("FavoriteIcon")).toHaveLength(0);
  fireEvent.click(hearts[1]);
  expect(
    screen.getAllByRole("button", { name: "Remove from favorites" }),
  ).toHaveLength(2);
  expect(screen.getAllByTestId("FavoriteIcon")).toHaveLength(2);
  expect(axios.post).toHaveBeenCalledTimes(1);
  act(() => {
    store.dispatch(addRecentlyPlayed(makeSong()));
  });
  expect(
    JSON.parse(sessionStorage.getItem("userPrefs") ?? "{}"),
  ).not.toHaveProperty("favoriteUpdates");
  await act(async () => pending.resolve({}));
  expect(store.getState().userPrefs.favorites).toEqual(["s1"]);
  expect(store.getState().userPrefs.favoriteUpdates).toEqual({});
  expect(
    screen.getAllByRole("button", { name: "Remove from favorites" })[0],
  ).not.toHaveAttribute("aria-busy");
});

test("unfavoriting immediately after favoriting saves the latest choice in order", async () => {
  const add = deferred<unknown>();
  const remove = deferred<unknown>();
  vi.mocked(axios.post)
    .mockReturnValueOnce(add.promise)
    .mockReturnValueOnce(remove.promise);
  const store = makeStore();
  render(
    <Provider store={store}>
      <FavoriteIcon songId="s1" />
    </Provider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Add to favorites" }));
  expect(screen.getByTestId("FavoriteIcon")).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Remove from favorites" }),
  );
  expect(screen.getByTestId("FavoriteBorderIcon")).toBeInTheDocument();
  expect(axios.post).toHaveBeenCalledTimes(1);
  await act(async () => add.resolve({}));
  expect(axios.post).toHaveBeenCalledTimes(2);
  expect(vi.mocked(axios.post).mock.calls.map((call) => call[0])).toEqual([
    "/api/addfavorite",
    "/api/deletefavorite",
  ]);
  expect(screen.getByTestId("FavoriteBorderIcon")).toBeInTheDocument();
  await act(async () => remove.resolve({}));
  expect(store.getState().userPrefs.favorites).toEqual([]);
  expect(store.getState().userPrefs.favoriteUpdates).toEqual({});
});

test("a failed queued save restores the last confirmed database state", async () => {
  const add = deferred<unknown>();
  const remove = deferred<void>();
  vi.mocked(axios.post)
    .mockReturnValueOnce(add.promise)
    .mockImplementationOnce(async () => {
      await remove.promise;
      throw new Error("offline");
    });
  const store = makeStore();
  render(
    <Provider store={store}>
      <FavoriteIcon songId="s1" />
    </Provider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Add to favorites" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Remove from favorites" }),
  );
  expect(screen.getByTestId("FavoriteBorderIcon")).toBeInTheDocument();
  await act(async () => add.resolve({}));
  await act(async () => remove.resolve(undefined));
  expect(screen.getByTestId("FavoriteIcon")).toBeInTheDocument();
  expect(store.getState().userPrefs.favorites).toEqual(["s1"]);
  expect(
    screen.getByText("Unable to update favorite. Please try again."),
  ).toBeInTheDocument();
});

test("unfavoriting immediately removes the last row and restores it if saving fails", async () => {
  const pending = deferred<void>();
  vi.mocked(axios.post).mockResolvedValueOnce({
    data: { favorites: [{ song: makeSong({ title: "Keep this favorite" }) }] },
  });
  const store = makeStore(["s1"]);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    </Provider>,
  );
  await screen.findByText("Keep this favorite");
  vi.mocked(axios.post).mockImplementationOnce(async () => {
    await pending.promise;
    throw new Error("offline");
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Remove from favorites" }),
  );
  expect(screen.queryByText("Keep this favorite")).not.toBeInTheDocument();
  expect(screen.getByText("Nothing Here Yet...")).toBeInTheDocument();
  expect(store.getState().audioplayer.viewingSongList).toEqual({});
  await act(async () => pending.resolve(undefined));
  expect(
    screen.getByRole("button", { name: "Remove from favorites" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText("Keep this favorite")).toBeInTheDocument();
  expect(
    screen.getByText("Unable to update favorite. Please try again."),
  ).toBeInTheDocument();
  expect(store.getState().userPrefs.favorites).toEqual(["s1"]);
});

test("unfavoriting removes a card before the database request completes", async () => {
  const pending = deferred<unknown>();
  const songs = [
    makeSong({ title: "First favorite" }),
    makeSong({ song_id: "s2", title: "Second favorite" }),
  ];
  vi.mocked(axios.post)
    .mockResolvedValueOnce({
      data: { favorites: songs.map((song) => ({ song })) },
    })
    .mockReturnValueOnce(pending.promise);
  const store = makeStore(["s1", "s2"]);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    </Provider>,
  );
  await screen.findByText("First favorite");
  fireEvent.click(
    screen.getAllByRole("button", { name: "Remove from favorites" })[0],
  );
  expect(screen.queryByText("First favorite")).not.toBeInTheDocument();
  expect(screen.getByText("Second favorite")).toBeInTheDocument();
  expect(store.getState().userPrefs.favoriteUpdates.s1.pending).toBe(true);
  expect(
    Object.keys(store.getState().audioplayer.viewingSongList ?? {}),
  ).toEqual(["s2"]);
  await act(async () => pending.resolve({}));
  expect(screen.queryByText("First favorite")).not.toBeInTheDocument();
  expect(store.getState().userPrefs.favorites).toEqual(["s2"]);
});

test("removing the last card on a page immediately adjusts pagination and the next playback queue", async () => {
  const pending = deferred<unknown>();
  const songs = Array.from({ length: 21 }, (_, index) =>
    makeSong({ song_id: `s${index}`, title: `Favorite ${index}` }),
  );
  vi.mocked(axios.post)
    .mockResolvedValueOnce({
      data: { favorites: songs.map((song) => ({ song })) },
    })
    .mockReturnValueOnce(pending.promise);
  const store = createTestStore({
    homepage: { user: makeUser() },
    userPrefs: { favorites: songs.map((song) => song.song_id) },
    audioplayer: { playingSongList: { s20: songs[20] }, playingIndex: "s20" },
  });
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/favorites?page=2"]}>
        <Favorites />
      </MemoryRouter>
    </Provider>,
  );
  await screen.findByText("Favorite 20");
  fireEvent.click(
    screen.getByRole("button", { name: "Remove from favorites" }),
  );
  expect(screen.queryByText("Favorite 20")).not.toBeInTheDocument();
  expect(screen.getByText("Favorite 0")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "page 1" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(store.getState().audioplayer.playingIndex).toBe("s20");
  fireEvent.click(screen.getByText("Favorite 0"));
  expect(store.getState().audioplayer.playingIndex).toBe("s0");
  expect(store.getState().audioplayer.playingSongList).not.toHaveProperty(
    "s20",
  );
  expect(
    Object.keys(store.getState().audioplayer.playingSongList ?? {}),
  ).toHaveLength(20);
  await act(async () => pending.resolve({}));
});

test("a failed removal returns to its original position without restoring a different successfully removed card", async () => {
  const failed = deferred<void>();
  const saved = deferred<unknown>();
  const songs = [1, 2, 3].map((number) =>
    makeSong({ song_id: `s${number}`, title: `Favorite ${number}` }),
  );
  vi.mocked(axios.post)
    .mockResolvedValueOnce({
      data: { favorites: songs.map((song) => ({ song })) },
    })
    .mockImplementationOnce(async () => {
      await failed.promise;
      throw new Error("offline");
    })
    .mockReturnValueOnce(saved.promise);
  const store = makeStore(["s1", "s2", "s3"]);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    </Provider>,
  );
  await screen.findByText("Favorite 1");
  fireEvent.click(
    screen.getAllByRole("button", { name: "Remove from favorites" })[0],
  );
  fireEvent.click(
    screen.getAllByRole("button", { name: "Remove from favorites" })[0],
  );
  expect(screen.queryByText("Favorite 1")).not.toBeInTheDocument();
  expect(screen.queryByText("Favorite 2")).not.toBeInTheDocument();
  await act(async () => saved.resolve({}));
  await act(async () => failed.resolve(undefined));
  expect(
    screen
      .getAllByText(/^Favorite [123]$/)
      .map((element) => element.textContent),
  ).toEqual(["Favorite 1", "Favorite 3"]);
  expect(store.getState().userPrefs.favorites).toEqual(["s1", "s3"]);
});

test("a favorite response from an ended session cannot change the next account's state", async () => {
  const pending = deferred<unknown>();
  vi.mocked(axios.post).mockReturnValueOnce(pending.promise);
  const store = makeStore();
  render(
    <Provider store={store}>
      <FavoriteIcon songId="s1" />
    </Provider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Add to favorites" }));
  expect(
    screen.getByRole("button", { name: "Remove from favorites" }),
  ).toBeInTheDocument();
  act(() => {
    store.dispatch(resetSessionState());
  });
  await act(async () => pending.resolve({}));
  expect(store.getState().userPrefs.favorites).toBeNull();
  expect(store.getState().userPrefs.favoriteUpdates).toEqual({});
});

test("one failed change does not undo another song's saved favorite", async () => {
  const first = deferred<void>();
  const second = deferred<unknown>();
  vi.mocked(axios.post)
    .mockImplementationOnce(async () => {
      await first.promise;
      throw new Error("offline");
    })
    .mockReturnValueOnce(second.promise);
  const store = makeStore();
  render(
    <Provider store={store}>
      <FavoriteIcon songId="s1" />
      <FavoriteIcon songId="s2" />
    </Provider>,
  );
  const hearts = screen.getAllByRole("button", { name: "Add to favorites" });
  fireEvent.click(hearts[0]);
  fireEvent.click(hearts[1]);
  expect(
    screen.getAllByRole("button", { name: "Remove from favorites" }),
  ).toHaveLength(2);
  await act(async () => second.resolve({}));
  await act(async () => first.resolve(undefined));
  expect(store.getState().userPrefs.favorites).toEqual(["s2"]);
  expect(
    screen.getAllByRole("button", { name: "Add to favorites" }),
  ).toHaveLength(1);
  expect(
    screen.getAllByRole("button", { name: "Remove from favorites" }),
  ).toHaveLength(1);
});
