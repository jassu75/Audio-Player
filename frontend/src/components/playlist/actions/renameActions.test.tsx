import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { createTestStore, makeSong } from "../../../test/fixtures";
import type { RenameDialogControls } from "./types/renameActions.types";
import RenamePlaylistTitle from "./playlist/rename-playlist/RenamePlaylistTitle";
import MoveSong from "./song/move-song/MoveSong";
import RenameSongTitle from "./song/rename-song/RenameSongTitle";
vi.mock("axios", () => ({ default: { post: vi.fn() } }));
const makeStore = () => createTestStore({
    homepage: { user: null, playlistCollection: [
            { id: "mine", title: "Mine", type: "user", collection: [
                    { playlist_id: "p1", playlist_title: "Original", playlist_cover_art: "playlist1" },
                    { playlist_id: "p2", playlist_title: "Destination", playlist_cover_art: "playlist1" },
                ] },
        ] },
    audioplayer: {
        viewingSongList: { s1: makeSong() },
        playingSongList: { s1: makeSong() },
        playingIndex: "s1",
    },
});
beforeEach(() => vi.clearAllMocks());
describe.each([
    ["playlist", (props: RenameDialogControls) => <RenamePlaylistTitle {...props} playlistId="p1" playlistTitle="Original"/>, {}],
    ["song", (props: RenameDialogControls) => <RenameSongTitle {...props} songId="s1" songTitle="Original"/>, {}],
] as const)("rename %s", (kind, Component, props) => {
    const titleFrom = (store: ReturnType<typeof makeStore>) => kind === "playlist"
        ? store.getState().homepage.playlistCollection?.[0].collection[0].playlist_title
        : store.getState().audioplayer.viewingSongList?.s1.title;
    test("keeps the title and dialog on failure, then saves on retry", async () => {
        vi.spyOn(console, "error").mockImplementation(() => { });
        vi.mocked(axios.post).mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ data: {} });
        const store = makeStore();
        const onClose = vi.fn();
        render(<Provider store={store}><Component open onClose={onClose} {...props}/></Provider>);
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "  Renamed  " } });
        fireEvent.click(screen.getByText("DONE"));
        await screen.findByText(`Unable to rename ${kind}. Please try again.`);
        expect(titleFrom(store)).toBe("Original");
        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByRole("textbox")).toHaveValue("  Renamed  ");
        fireEvent.click(screen.getByText("DONE"));
        await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
        expect(titleFrom(store)).toBe("Renamed");
        expect(axios.post).toHaveBeenLastCalledWith(`/api/update${kind}title`, {
            [kind === "playlist" ? "playlistId" : "songId"]: kind === "playlist" ? "p1" : "s1",
            newTitle: "Renamed",
        });
        expect(store.getState().audioplayer.playingSongList?.s1.title).toBe(kind === "song" ? "Renamed" : "Original");
        vi.restoreAllMocks();
    });
    test("rejects blank and unchanged titles", () => {
        render(<Provider store={makeStore()}><Component open onClose={vi.fn()} {...props}/></Provider>);
        for (const value of ["   ", "  Original  "]) {
            fireEvent.change(screen.getByRole("textbox"), { target: { value } });
            fireEvent.click(screen.getByText("DONE"));
        }
        expect(axios.post).not.toHaveBeenCalled();
    });
});
test("a failed move preserves the song and allows retry", async () => {
    vi.spyOn(console, "error").mockImplementation(() => { });
    vi.mocked(axios.post).mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ data: {} });
    const store = makeStore();
    const onClose = vi.fn();
    render(<Provider store={store}><MoveSong open onClose={onClose} songId="s1" playlistId="p1"/></Provider>);
    fireEvent.click(screen.getByText("Destination"));
    fireEvent.click(screen.getByText("DONE"));
    await screen.findByText("Unable to move song. Please try again.");
    expect(store.getState().audioplayer.viewingSongList?.s1).toBeDefined();
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("DONE"));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(store.getState().audioplayer.viewingSongList?.s1).toBeUndefined();
    expect(store.getState().audioplayer.playingSongList?.s1).toBeDefined();
    vi.restoreAllMocks();
});
