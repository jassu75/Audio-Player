import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { Provider } from "react-redux";
import { expect, test, vi } from "vitest";
import {
  playSong,
  renameViewingSong,
  setPlayingIndex,
  setViewingSongList,
} from "../../../redux/slices/audioPlayerSlice";
import { createTestStore, makeSong, makeUser } from "../../../test/fixtures";
import { recordPlayEvent } from "../../../services/listeningHistory";
import axios from "axios";
import { startSearchPlayback } from "../../../redux/slices/audioPlayerSlice";
import { deferred } from "../../../test/fixtures";
import useAudioPlayer from "./useAudioPlayer";
vi.mock("../../../services/listeningHistory", () => ({
  recordPlayEvent: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("axios", () => ({ default: { post: vi.fn() } }));
test("renaming a playing track leaves audio running; switching tracks loads the new source", async () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  const pause = vi
    .spyOn(HTMLMediaElement.prototype, "pause")
    .mockImplementation(() => {});
  const load = vi
    .spyOn(HTMLMediaElement.prototype, "load")
    .mockImplementation(() => {});
  const song = makeSong();
  const store = createTestStore({
    audioplayer: {
      viewingSongList: { s1: song },
      playingSongList: {
        s1: song,
        s2: makeSong({
          song_id: "s2",
          audio_url: "https://example.com/two.mp3",
        }),
      },
      playingIndex: "s1",
    },
  });
  const Harness = () => {
    const { audioRef } = useAudioPlayer();
    return <audio ref={audioRef} />;
  };
  const { unmount } = render(
    <Provider store={store}>
      <Harness />
    </Provider>,
  );
  await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
  act(() =>
    store.dispatch(renameViewingSong({ songId: "s1", newTitle: "Renamed" })),
  );
  expect(pause).not.toHaveBeenCalled();
  expect(load).toHaveBeenCalledTimes(1);
  act(() => store.dispatch(setPlayingIndex("s2")));
  await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
  expect(pause).toHaveBeenCalledTimes(1);
  unmount();
  vi.restoreAllMocks();
});

test("track selection starts audio inside the user action and advances without waiting for React", async () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  const pause = vi
    .spyOn(HTMLMediaElement.prototype, "pause")
    .mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  const store = createTestStore({
    audioplayer: {
      viewingSongList: {
        s1: makeSong(),
        s2: makeSong({
          song_id: "s2",
          audio_url: "https://example.com/two.mp3",
        }),
      },
    },
  });
  let element: HTMLAudioElement | null = null;
  const Harness = () => {
    const { audioRef } = useAudioPlayer();
    return (
      <audio
        ref={(node) => {
          audioRef.current = node;
          element = node;
        }}
      />
    );
  };
  const { unmount } = render(
    <Provider store={store}>
      <Harness />
    </Provider>,
  );
  expect(play).not.toHaveBeenCalled();
  act(() => {
    store.dispatch(playSong("s1"));
    expect(play).toHaveBeenCalledTimes(1);
  });
  await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
  if (!element) throw new Error("Audio element missing");
  fireEvent.ended(element);
  expect(store.getState().audioplayer.playingIndex).toBe("s2");
  expect(play).toHaveBeenCalledTimes(2);
  const pauseCount = pause.mock.calls.length;
  act(() => store.dispatch(setViewingSongList(null)));
  expect(pause).toHaveBeenCalledTimes(pauseCount);
  unmount();
  vi.restoreAllMocks();
});

test("blocked mobile autoplay gives a retry instead of pretending the track is playing", async () => {
  vi.spyOn(HTMLMediaElement.prototype, "play")
    .mockRejectedValueOnce(
      new DOMException("Gesture required", "NotAllowedError"),
    )
    .mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  const song = makeSong();
  const store = createTestStore({
    audioplayer: { playingSongList: { s1: song }, playingIndex: "s1" },
  });
  const Harness = () => {
    const player = useAudioPlayer();
    return (
      <>
        <audio ref={player.audioRef} />
        <p role="status">{player.playbackError}</p>
        <button onClick={player.handleTogglePlay}>
          {player.isPlaying ? "Pause" : "Play"}
        </button>
      </>
    );
  };
  const { unmount } = render(
    <Provider store={store}>
      <Harness />
    </Provider>,
  );
  await screen.findByText("Tap Play to start listening.");
  fireEvent.click(screen.getByRole("button", { name: "Play" }));
  await screen.findByRole("button", { name: "Pause" });
  expect(screen.getByRole("status")).toBeEmptyDOMElement();
  unmount();
  vi.restoreAllMocks();
});

test("actual playback tracks uploaded and system songs once, without counting resumes or buffering again", async () => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  const systemSong = makeSong({ user_id: null, source: "system" });
  const ownSong = makeSong({
    song_id: "s2",
    user_id: "u1",
    source: "user",
    audio_url: "https://example.com/two.mp3",
  });
  const store = createTestStore({
    homepage: { user: makeUser() },
    audioplayer: {
      playingSongList: { s1: systemSong, s2: ownSong },
      playingIndex: "s1",
    },
  });
  const Harness = () => {
    const { audioRef } = useAudioPlayer();
    return <audio data-testid="audio" ref={audioRef} />;
  };
  const { unmount } = render(
    <Provider store={store}>
      <Harness />
    </Provider>,
  );
  const audio = screen.getByTestId("audio");
  expect(recordPlayEvent).not.toHaveBeenCalled();
  fireEvent.playing(audio);
  fireEvent.waiting(audio);
  fireEvent.playing(audio);
  fireEvent.pause(audio);
  fireEvent.playing(audio);
  expect(recordPlayEvent).toHaveBeenCalledTimes(1);
  expect(recordPlayEvent).toHaveBeenLastCalledWith({
    event_id: expect.any(String),
    user_id: "u1",
    song_id: "s1",
  });
  expect(store.getState().userPrefs.recentlyPlayed?.[0].song_id).toBe("s1");
  fireEvent.ended(audio);
  fireEvent.playing(audio);
  expect(recordPlayEvent).toHaveBeenCalledTimes(2);
  expect(
    store.getState().userPrefs.recentlyPlayed?.map((song) => song.song_id),
  ).toEqual(["s2", "s1"]);
  expect(store.getState().userPrefs.listens).toEqual({ s1: 1, s2: 1 });
  unmount();
});

test("search playback starts inside the click and adding random tracks does not reload the audio", async () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  const load = vi
    .spyOn(HTMLMediaElement.prototype, "load")
    .mockImplementation(() => {});
  const pause = vi
    .spyOn(HTMLMediaElement.prototype, "pause")
    .mockImplementation(() => {});
  const pending = deferred<{
    data: { randomSongs: ReturnType<typeof makeSong>[] };
  }>();
  vi.mocked(axios.post).mockReturnValueOnce(pending.promise);
  const selected = makeSong();
  const store = createTestStore({ homepage: { user: makeUser() } });
  const Harness = () => {
    const { audioRef } = useAudioPlayer();
    return <audio ref={audioRef} />;
  };
  const { unmount } = render(
    <Provider store={store}>
      <Harness />
    </Provider>,
  );
  act(() => {
    store.dispatch(
      startSearchPlayback({ song: selected, sessionId: "search" }),
    );
    expect(play).toHaveBeenCalledTimes(1);
  });
  await act(async () =>
    pending.resolve({
      data: {
        randomSongs: [
          makeSong({
            song_id: "random",
            audio_url: "https://example.com/random.mp3",
          }),
        ],
      },
    }),
  );
  expect(store.getState().audioplayer.playingSongList).toHaveProperty("random");
  expect(play).toHaveBeenCalledTimes(1);
  expect(load).toHaveBeenCalledTimes(1);
  expect(pause).not.toHaveBeenCalled();
  unmount();
});
