import { fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React, { act } from "react";
import { Provider } from "react-redux";
import { afterEach, expect, test, vi } from "vitest";
import FavoriteIcon from "../../../components/favorites/favorite-icon/FavoriteIcon";
import { createTestStore, deferred, makeSong, makeUser } from "../../../test/fixtures";
import type { Song } from "../../../components/playlist/playlist-songs-list/playlist-song/types/song.types";
import useFetchFavoriteIds from "./useFetchFavoriteIds";
import useFetchFavorites from "./useFetchFavorites";
vi.mock("axios", () => ({ default: { post: vi.fn() } }));
const makeStore = (favorites: string[] | null = []) => createTestStore({
    homepage: { user: makeUser(), playlistCollection: [] },
    audioplayer: { viewingSongList: { old: makeSong({ song_id: "old", title: "Previous playlist" }) }, playingSongList: null, playingIndex: null },
    userPrefs: { favorites, recentlyPlayed: [], listens: {} },
});
const wrap = (store: ReturnType<typeof makeStore>) => ({ children }: React.PropsWithChildren) => <Provider store={store}>{children}</Provider>;
afterEach(() => vi.restoreAllMocks());
test("Favorites fetches its own songs even when another page already populated the list", async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({ data: { favorites: [{ song: { song_id: "favorite", title: "Favorite" } }] } });
    const store = makeStore();
    const { result } = renderHook(useFetchFavorites, { wrapper: wrap(store) });
    await waitFor(() => expect(result.current.favoritesLoading).toBe(false));
    expect(store.getState().audioplayer.viewingSongList).toEqual({ favorite: { song_id: "favorite", title: "Favorite" } });
});
test("Favorites surfaces a failed request instead of loading forever", async () => {
    vi.spyOn(console, "error").mockImplementation(() => { });
    vi.mocked(axios.post).mockRejectedValueOnce(new Error("offline"));
    const { result } = renderHook(useFetchFavorites, { wrapper: wrap(makeStore()) });
    await waitFor(() => expect(result.current.favoritesError).toBe(true));
    expect(result.current.favoritesLoading).toBe(false);
});
test("favorite ID request errors reach the route guard", async () => {
    vi.spyOn(console, "error").mockImplementation(() => { });
    vi.mocked(axios.post).mockRejectedValueOnce(new Error("offline"));
    const { result } = renderHook(useFetchFavoriteIds, { wrapper: wrap(makeStore(null)) });
    await waitFor(() => expect(result.current.favoritesIdError).toBe(true));
    expect(result.current.favoritesIdLoading).toBe(false);
});
test("failed favorite updates leave both copies unchanged and allow retry", async () => {
    vi.spyOn(console, "error").mockImplementation(() => { });
    vi.mocked(axios.post).mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({});
    const store = makeStore();
    render(<Provider store={store}><FavoriteIcon songId="s1"/><FavoriteIcon songId="s1"/></Provider>);
    fireEvent.click(screen.getAllByRole("button", { name: "Add to favorites" })[0]);
    await waitFor(() => expect(screen.getAllByRole("button", { name: "Add to favorites" })[0]).toBeEnabled());
    expect(store.getState().userPrefs.favorites).toEqual([]);
    fireEvent.click(screen.getAllByRole("button", { name: "Add to favorites" })[0]);
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
    await act(async () => resolve({ data: { favorites: [{ song: makeSong({ song_id: "stale" }) }] } }));
    expect(store.getState().audioplayer.viewingSongList).toBeNull();
});
