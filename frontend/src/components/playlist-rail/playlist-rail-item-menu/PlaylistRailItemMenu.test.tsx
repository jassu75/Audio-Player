import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { expect, test, vi } from "vitest";
import homepage from "../../../redux/slices/homepageSlice";
import usePlaylistRailItem from "../playlist-rail-item/hooks/usePlaylistRailItem";
import PlaylistRailItemMenu from "./PlaylistRailItemMenu";
vi.mock("../../../config/axiosAuth", () => ({ default: { post: vi.fn() } }));
vi.mock("axios", () => ({ default: { post: vi.fn() } }));
test("canceling playlist rename closes the dialog and lets the menu reopen", async () => {
  const Harness = () => (
    <PlaylistRailItemMenu
      playlist={{
        playlist_id: "p1",
        playlist_title: "Original",
        playlist_cover_art: "cover.jpg",
      }}
      playlistRailItemProps={usePlaylistRailItem()}
    />
  );
  render(
    <Provider store={configureStore({ reducer: { homepage } })}>
      <Harness />
    </Provider>,
  );
  fireEvent.click(screen.getByRole("button"));
  fireEvent.click(screen.getByText("Rename"));
  expect(screen.getByText("New Playlist Title")).toBeInTheDocument();
  fireEvent.click(screen.getByText("CANCEL"));
  await waitFor(() =>
    expect(screen.queryByText("New Playlist Title")).not.toBeInTheDocument(),
  );
  fireEvent.click(screen.getByRole("button"));
  expect(screen.getByRole("menuitem", { name: "Rename" })).not.toHaveAttribute(
    "aria-disabled",
    "true",
  );
});
