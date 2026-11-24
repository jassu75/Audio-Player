import { render, screen } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { expect, test, vi } from "vitest";
import { createTestStore, makePlaylist } from "../../test/fixtures";
import Playlist from "./Playlist";
vi.mock("axios", () => ({ default: { post: vi.fn() } }));
vi.mock(
  "../../components/playlist/helpers/playlist-upload-button/PlaylistUploadButton",
  () => ({ default: () => <button>Upload songs</button> }),
);
vi.mock(
  "../../components/playlist/playlist-songs-list/PlaylistSongsList",
  () => ({
    default: ({ page }: { page: number }) => <div>Song page {page}</div>,
  }),
);
vi.mock("../helpers/error/Error", () => ({
  default: () => <div>Playlist load failed</div>,
}));
vi.mock("../../components/skeletons/playlist/PlaylistSkeleton", () => ({
  default: () => <div>Loading playlist</div>,
}));
function renderPlaylist() {
  const store = createTestStore({
    homepage: {
      user: null,
      playlistCollection: [
        {
          id: "mine",
          title: "Mine",
          type: "user",
          collection: [makePlaylist({ playlist_title: "My playlist" })],
        },
      ],
    },
    audioplayer: {
      viewingSongList: null,
      playingSongList: null,
      playingIndex: null,
    },
  });
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/playlists/p1?page=2"]}>
        <Routes>
          <Route path="/playlists/:playlistId" element={<Playlist />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}
test("empty playlists keep the upload action available", async () => {
  vi.mocked(axios.post).mockResolvedValueOnce({ data: { playlists: [] } });
  renderPlaylist();
  await screen.findByText("Nothing Here Yet...");
  expect(
    screen.getByRole("button", { name: "Upload songs" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Audio in My playlist")).toBeInTheDocument();
});
test("playlist request failure replaces the loading screen", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(axios.post).mockRejectedValueOnce(new Error("offline"));
  renderPlaylist();
  await screen.findByText("Playlist load failed");
  expect(screen.queryByText("Loading playlist")).not.toBeInTheDocument();
  vi.restoreAllMocks();
});
test("a removed final page falls back to the last available page", async () => {
  vi.mocked(axios.post).mockResolvedValueOnce({
    data: { playlists: [{ songs: { song_id: "s1", title: "Song" } }] },
  });
  renderPlaylist();
  expect(await screen.findByText("Song page 1")).toBeInTheDocument();
});
