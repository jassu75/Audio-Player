import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import { createTestStore, makeSong, makeUser } from "../../test/fixtures";
import Search from "./Search";
import useSearchPlayback from "../../components/audio-player/hooks/useSearchPlayback";

vi.mock("axios", () => ({ default: { post: vi.fn() } }));
const SearchQueue = () => { useSearchPlayback(); return null; };

test("search displays and plays uploaded and system tracks in the same results", async () => {
    const ownSong = makeSong({ song_id: "own", title: "My recording", user_id: "u1", source: "user" });
    const sharedSong = makeSong({ song_id: "shared", title: "Shared track", user_id: null, source: "system" });
    vi.mocked(axios.post).mockImplementation(async path => ({ data: path === "/api/fetchsearchsongs"
        ? { searchResults: [ownSong, sharedSong] }
        : path === "/api/fetchrandomsongs" ? { randomSongs: [ownSong, sharedSong] } : {} }));
    const store = createTestStore({ homepage: { user: makeUser() }, userPrefs: { recentlyPlayed: [], favorites: [] } });
    render(<Provider store={store}><SearchQueue /><MemoryRouter initialEntries={["/search?searchtext=track"]}><Search /></MemoryRouter></Provider>);
    expect(await screen.findByText("Shared track")).toBeInTheDocument();
    expect(screen.getByText("My recording")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Shared track"));
    expect(store.getState().audioplayer.playingIndex).toBe("shared");
    await waitFor(() => expect(Object.keys(store.getState().audioplayer.playingSongList ?? {})).toEqual(["shared", "own"]));
    fireEvent.click(screen.getAllByRole("button", { name: "Add to favorites" })[1]);
    await screen.findByRole("button", { name: "Remove from favorites" });
    expect(store.getState().userPrefs.favorites).toContain("shared");
});
