import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { expect, test, vi } from "vitest";
import { createTestStore, makeSong } from "../../test/fixtures";
import AudioPlayer from "./AudioPlayer";

test("the mobile full player traps controls only while open and can collapse without stopping audio", async () => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  const song = makeSong();
  const store = createTestStore({ audioplayer: { playingSongList: { s1: song }, playingIndex: "s1" } });
  const { unmount } = render(<Provider store={store}><AudioPlayer /></Provider>);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Open player for Original" }));
  const dialog = await screen.findByRole("dialog", { name: "Original" });
  expect(within(dialog).getByRole("slider", { name: "Playback position" })).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole("button", { name: "Collapse player" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(pause).not.toHaveBeenCalled();
  unmount();
  vi.restoreAllMocks();
});
