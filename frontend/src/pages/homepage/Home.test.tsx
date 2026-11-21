import { fireEvent, render, screen, within } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";
import { createTestStore, makePlaylist, makeSong, makeUser } from "../../test/fixtures";
import Favorites from "../favorites/Favorites";
import Playlist from "../playlist/Playlist";
import Home from "./Home";
import { PLAYLIST_COLLECTIONS } from "./constants/playlistCollections";

vi.mock("axios", () => ({ default: { post: vi.fn() } }));
vi.mock("../../config/axiosAuth", () => ({ default: { post: vi.fn() } }));
vi.mock("../../components/navbar/Navbar", () => ({ default: () => <nav>Musify</nav> }));
vi.mock("../helpers/error/Error", () => ({ default: () => <div>Unable to load songs</div> }));
beforeEach(() => vi.clearAllMocks());

const renderHome = async () => {
    const oldSong = makeSong({ song_id: "old", title: "Previous playlist song" });
    const store = createTestStore({
        homepage: { user: makeUser(), playlistCollection: await Promise.all(PLAYLIST_COLLECTIONS.map(async config => ({
            id: config.id,
            title: config.title,
            type: config.type,
            collection: config.cache ? [makePlaylist({ playlist_id: config.id })] : await config.loadPlaylists("u1", new AbortController().signal),
        }))) },
        audioplayer: { viewingSongList: { old: oldSong }, playingSongList: { old: oldSong }, playingIndex: "old" },
        userPrefs: { favorites: ["s1"] },
    });
    render(<Provider store={store}><MemoryRouter><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/playlists/:playlistId" element={<Playlist />} />
    </Routes></MemoryRouter></Provider>);
    return store;
};

test("For You is the first home row and links the three existing covers to their song lists", async () => {
    await renderHome();
    expect(PLAYLIST_COLLECTIONS[0].type).toBe("personal");
    const rail = screen.getByRole("region", { name: "For You" });
    expect(within(rail).getAllByRole("link").map(link => link.textContent)).toEqual(["Favorites", "Recently Played", "Most Listened"]);
    expect(within(rail).getByRole("link", { name: "Favorites" })).toHaveAttribute("href", "/favorites");
    expect(within(rail).getByRole("link", { name: "Recently Played" })).toHaveAttribute("href", "/playlists/recently-played/?page=1");
    expect(within(rail).getByRole("link", { name: "Most Listened" })).toHaveAttribute("href", "/playlists/most-played/?page=1");
    expect([...rail.querySelectorAll("img")].map(image => image.getAttribute("src"))).toEqual([
        "/images/ForYou/FavoritesItem.jpeg", "/images/ForYou/RecentsItem.png", "/images/ForYou/TopSongsItem.jpg",
    ]);
    expect(rail.compareDocumentPosition(screen.getByText("Your Playlists")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test.each([
    ["Recently Played", "/api/fetchrecentlyplayed", "recently_played"],
    ["Most Listened", "/api/fetchMostListened", "most_listened"],
] as const)("%s opens its backend list and selecting a song starts that queue", async (title, endpoint, responseKey) => {
    const songs = [makeSong({ title: "First personal track" }), makeSong({ song_id: "s2", title: "Second personal track" })];
    vi.mocked(axios.post).mockResolvedValueOnce({ data: { [responseKey]: songs } });
    const store = await renderHome();
    fireEvent.click(screen.getByRole("link", { name: title }));
    expect(await screen.findByText(`Audio in ${title}`)).toBeInTheDocument();
    expect(await screen.findByText("First personal track")).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledWith(endpoint, { user_id: "u1" }, expect.objectContaining({ withCredentials: true }));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(Object.keys(store.getState().audioplayer.viewingSongList ?? {})).toEqual(["s1", "s2"]);
    expect(screen.queryByText("Previous playlist song")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /upload/i })).not.toBeInTheDocument();
    expect(store.getState().audioplayer.playingIndex).toBe("old");
    fireEvent.click(screen.getByText("Second personal track"));
    expect(store.getState().audioplayer.playingIndex).toBe("s2");
    expect(store.getState().audioplayer.playingSongList?.s2.audio_url).toBe(songs[1].audio_url);
});

test("the Favorites shortcut fetches favorites and plays the selected song", async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({ data: { favorites: [{ song: makeSong({ title: "Favorite track" }) }] } });
    const store = await renderHome();
    fireEvent.click(screen.getByRole("link", { name: "Favorites" }));
    fireEvent.click(await screen.findByText("Favorite track"));
    expect(axios.post).toHaveBeenCalledWith("/api/fetchfavorites", { user_id: "u1" }, expect.objectContaining({ withCredentials: true }));
    expect(store.getState().audioplayer.playingIndex).toBe("s1");
});

test("an empty personal list displays its title and empty state", async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({ data: { recently_played: [] } });
    await renderHome();
    fireEvent.click(screen.getByRole("link", { name: "Recently Played" }));
    expect(await screen.findByText("Nothing Here Yet...")).toBeInTheDocument();
    expect(screen.getByText("Audio in Recently Played")).toBeInTheDocument();
});

test("a personal-list request failure displays an error instead of stale songs", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(axios.post).mockRejectedValueOnce(new Error("offline"));
    await renderHome();
    fireEvent.click(screen.getByRole("link", { name: "Most Listened" }));
    expect(await screen.findByText("Unable to load songs")).toBeInTheDocument();
    expect(screen.queryByText("Previous playlist song")).not.toBeInTheDocument();
});

test("system playlist tracks can be favorited without moving or interrupting the playback queue", async () => {
    const sharedSong = makeSong({ song_id: "shared", title: "Shared database track", source: "system", user_id: null });
    vi.mocked(axios.post).mockResolvedValueOnce({ data: { playlists: [{ songs: sharedSong }] } }).mockResolvedValueOnce({ data: {} });
    const store = await renderHome();
    const popular = screen.getByRole("region", { name: "Popular Playlists" });
    fireEvent.click(within(popular).getByRole("link"));
    await screen.findByText("Shared database track");
    fireEvent.click(screen.getByRole("button", { name: "Add to favorites" }));
    await screen.findByRole("button", { name: "Remove from favorites" });
    expect(axios.post).toHaveBeenLastCalledWith("/api/addfavorite", { user_id: "u1", favorite_id: "shared" }, expect.anything());
    expect(store.getState().userPrefs.favorites).toContain("shared");
    expect(store.getState().audioplayer.playingIndex).toBe("old");
    expect(screen.queryByText("Rename")).not.toBeInTheDocument();
});
