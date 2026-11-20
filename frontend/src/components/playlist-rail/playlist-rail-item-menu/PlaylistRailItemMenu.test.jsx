import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PlaylistRailItemMenu from "./PlaylistRailItemMenu";
import usePlaylistRailItem from "../playlist-rail-item/hooks/usePlaylistRailItem";
import homepage from "../../../redux/slices/homepageSlice.js";

jest.mock("../../../config/axiosAuth", () => ({ post: jest.fn() }));
jest.mock("axios", () => ({ post: jest.fn() }));

test("canceling playlist rename closes the dialog and lets the menu reopen", async () => {
  const Harness = () => <PlaylistRailItemMenu
    playlist={{ playlist_id: "p1", playlist_title: "Original" }}
    playlistRailItemProps={usePlaylistRailItem()}
  />;
  render(<Provider store={configureStore({ reducer: { homepage } })}><Harness /></Provider>);
  fireEvent.click(screen.getByRole("button"));
  fireEvent.click(screen.getByText("Rename"));
  expect(screen.getByText("New Playlist Title")).toBeInTheDocument();
  fireEvent.click(screen.getByText("CANCEL"));
  await waitFor(() => expect(screen.queryByText("New Playlist Title")).not.toBeInTheDocument());
  fireEvent.click(screen.getByRole("button"));
  expect(screen.getByRole("menuitem", { name: "Rename" })).not.toHaveAttribute("aria-disabled", "true");
});
