import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import homepage from "../../../redux/slices/homepageSlice.js";
import audioplayer from "../../../redux/slices/audioPlayerSlice.js";
import RenamePlaylistTitle from "./playlist/rename-playlist/RenamePlaylistTitle";
import RenameSongTitle from "./song/rename-song/RenameSongTitle";
import MoveSong from "./song/move-song/MoveSong";

jest.mock("axios", () => ({ post: jest.fn() }));

const makeStore = () => configureStore({
  reducer: { homepage, audioplayer },
  preloadedState: {
    homepage: { user: null, playlistCollection: [
      { id: "mine", type: "user", collection: [
        { playlist_id: "p1", playlist_title: "Original", playlist_cover_art: "playlist1" },
        { playlist_id: "p2", playlist_title: "Destination", playlist_cover_art: "playlist1" },
      ] },
    ] },
    audioplayer: {
      viewingSongList: { s1: { song_id: "s1", title: "Original" } },
      playingSongList: { s1: { song_id: "s1", title: "Original" } },
      playingIndex: "s1",
    },
  },
});

beforeEach(() => jest.clearAllMocks());

describe.each([
  ["playlist", RenamePlaylistTitle, { playlistId: "p1", playlistTitle: "Original" }],
  ["song", RenameSongTitle, { songId: "s1", songTitle: "Original" }],
])("rename %s", (kind, Component, props) => {
  const titleFrom = (store) => kind === "playlist"
    ? store.getState().homepage.playlistCollection[0].collection[0].playlist_title
    : store.getState().audioplayer.viewingSongList.s1.title;

  test("keeps the title and dialog on failure, then saves on retry", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    axios.post.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ data: {} });
    const store = makeStore();
    const onClose = jest.fn();
    render(<Provider store={store}><Component open onClose={onClose} {...props} /></Provider>);
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
    expect(store.getState().audioplayer.playingSongList.s1.title).toBe(kind === "song" ? "Renamed" : "Original");
    console.error.mockRestore();
  });

  test("rejects blank and unchanged titles", () => {
    render(<Provider store={makeStore()}><Component open onClose={jest.fn()} {...props} /></Provider>);
    for (const value of ["   ", "  Original  "]) {
      fireEvent.change(screen.getByRole("textbox"), { target: { value } });
      fireEvent.click(screen.getByText("DONE"));
    }
    expect(axios.post).not.toHaveBeenCalled();
  });
});

test("a failed move preserves the song and allows retry", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  axios.post.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ data: {} });
  const store = makeStore();
  const onClose = jest.fn();
  render(<Provider store={store}><MoveSong open onClose={onClose} songId="s1" playlistId="p1" /></Provider>);
  fireEvent.click(screen.getByText("Destination"));
  fireEvent.click(screen.getByText("DONE"));
  await screen.findByText("Unable to move song. Please try again.");
  expect(store.getState().audioplayer.viewingSongList.s1).toBeDefined();
  expect(onClose).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("DONE"));
  await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  expect(store.getState().audioplayer.viewingSongList.s1).toBeUndefined();
  expect(store.getState().audioplayer.playingSongList.s1).toBeDefined();
  console.error.mockRestore();
});
