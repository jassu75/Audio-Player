import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import Playlist from "./Playlist";
import homepage from "../../redux/slices/homepageSlice.js";
import audioplayer from "../../redux/slices/audioPlayerSlice.js";

jest.mock("axios", () => ({ post: jest.fn() }));
jest.mock("../../components/playlist/helpers/playlist-upload-button/PlaylistUploadButton", () => () => <button>Upload songs</button>);
jest.mock("../../components/playlist/playlist-songs-list/PlaylistSongsList", () => ({ page }) => <div>Song page {page}</div>);
jest.mock("../helpers/error/Error", () => () => <div>Playlist load failed</div>);
jest.mock("../../components/skeletons/playlist/PlaylistSkeleton", () => () => <div>Loading playlist</div>);

function renderPlaylist() {
  const store = configureStore({
    reducer: { homepage, audioplayer },
    preloadedState: {
      homepage: { user: null, playlistCollection: [{ id: "mine", type: "user", collection: [
        { playlist_id: "p1", playlist_title: "My playlist" },
      ] }] },
      audioplayer: { viewingSongList: null, playingSongList: null, playingIndex: null },
    },
  });
  render(<Provider store={store}><MemoryRouter initialEntries={["/playlists/p1?page=2"]}>
    <Routes><Route path="/playlists/:playlistId" element={<Playlist />} /></Routes>
  </MemoryRouter></Provider>);
}

test("empty playlists keep the upload action available", async () => {
  axios.post.mockResolvedValueOnce({ data: { playlists: [] } });
  renderPlaylist();
  await screen.findByText("Nothing Here Yet...");
  expect(screen.getByRole("button", { name: "Upload songs" })).toBeInTheDocument();
  expect(screen.getByText("Audio in My playlist")).toBeInTheDocument();
});

test("playlist request failure replaces the loading screen", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  axios.post.mockRejectedValueOnce(new Error("offline"));
  renderPlaylist();
  await screen.findByText("Playlist load failed");
  expect(screen.queryByText("Loading playlist")).not.toBeInTheDocument();
  console.error.mockRestore();
});

test("a removed final page falls back to the last available page", async () => {
  axios.post.mockResolvedValueOnce({ data: { playlists: [{ songs: { song_id: "s1", title: "Song" } }] } });
  renderPlaylist();
  expect(await screen.findByText("Song page 1")).toBeInTheDocument();
});
