import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { expect, test, vi } from "vitest";
import { createTestStore, makeSong } from "../../test/fixtures";
import AudioPlayer from "./AudioPlayer";
import useMediaQuery from "@mui/material/useMediaQuery";

vi.mock("@mui/material/useMediaQuery", () => ({ default: vi.fn(() => false) }));

test("the mobile full player traps controls only while open and can collapse without stopping audio", async () => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  const pause = vi
    .spyOn(HTMLMediaElement.prototype, "pause")
    .mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  const song = makeSong();
  const store = createTestStore({
    audioplayer: { playingSongList: { s1: song }, playingIndex: "s1" },
  });
  const { unmount } = render(
    <Provider store={store}>
      <AudioPlayer />
    </Provider>,
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Open player for Original" }),
  );
  const dialog = await screen.findByRole("dialog", { name: "Original" });
  expect(
    within(dialog).getByRole("slider", { name: "Playback position" }),
  ).toBeInTheDocument();
  fireEvent.click(
    within(dialog).getByRole("button", { name: "Collapse player" }),
  );
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(pause).not.toHaveBeenCalled();
  unmount();
  vi.restoreAllMocks();
});

test.each([false, true])("shuffle controls playback without restarting the current track (desktop: %s)", async (desktop) => {
  vi.mocked(useMediaQuery).mockReturnValue(desktop);
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  const load = vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  const store = createTestStore({ audioplayer: {
    playingSongList: {
      s1: makeSong(),
      s2: makeSong({ song_id: "s2", audio_url: "https://example.com/two.mp3" }),
      s3: makeSong({ song_id: "s3", audio_url: "https://example.com/three.mp3" }),
    },
    playingIndex: "s1",
  } });
  const { container, unmount } = render(<Provider store={store}><AudioPlayer /></Provider>);
  if (!desktop) fireEvent.click(screen.getByRole("button", { name: "Open player for Original" }));
  const shuffle = await screen.findByRole("button", { name: "Shuffle" });
  const audio = container.querySelector("audio");
  if (!audio) throw new Error("Audio element missing");
  audio.currentTime = 35;
  expect(shuffle).toHaveAttribute("aria-pressed", "false");
  fireEvent.click(shuffle);
  expect(shuffle).toHaveAttribute("aria-pressed", "true");
  expect(audio.currentTime).toBe(35);
  expect(play).toHaveBeenCalledTimes(1);
  expect(load).toHaveBeenCalledTimes(1);
  expect(pause).not.toHaveBeenCalled();
  vi.spyOn(Math, "random").mockReturnValue(0.99);
  fireEvent.ended(audio);
  expect(store.getState().audioplayer.playingIndex).toBe("s3");
  const controls = desktop ? screen : within(screen.getByRole("dialog"));
  fireEvent.click(controls.getByRole("button", { name: "Next track" }));
  expect(store.getState().audioplayer.playingIndex).toBe("s2");
  fireEvent.click(shuffle);
  expect(shuffle).toHaveAttribute("aria-pressed", "false");
  fireEvent.ended(audio);
  expect(store.getState().audioplayer.playingIndex).toBe("s3");
  unmount();
  vi.restoreAllMocks();
});

test("shuffling a single-track queue replays it without losing the queue", async () => {
  vi.mocked(useMediaQuery).mockReturnValue(true);
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  const store = createTestStore({ audioplayer: { playingSongList: { s1: makeSong() }, playingIndex: "s1" } });
  const { container, unmount } = render(<Provider store={store}><AudioPlayer /></Provider>);
  fireEvent.click(screen.getByRole("button", { name: "Shuffle" }));
  const audio = container.querySelector("audio");
  if (!audio) throw new Error("Audio element missing");
  audio.currentTime = 120;
  fireEvent.ended(audio);
  expect(store.getState().audioplayer.playingIndex).toBe("s1");
  expect(audio.currentTime).toBe(0);
  expect(play).toHaveBeenCalledTimes(2);
  unmount();
  vi.restoreAllMocks();
});
