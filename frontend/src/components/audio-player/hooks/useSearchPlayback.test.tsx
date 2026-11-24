import { act, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import axios from "axios";
import { expect, test, vi } from "vitest";
import {
  createTestStore,
  deferred,
  makeSong,
  makeUser,
} from "../../../test/fixtures";
import {
  playNext,
  playSong,
  renameViewingSong,
  setViewingSongList,
  startSearchPlayback,
} from "../../../redux/slices/audioPlayerSlice";
import useSearchPlayback from "./useSearchPlayback";

vi.mock("axios", () => ({ default: { post: vi.fn() } }));
const setup = () => {
  const selected = makeSong({
    song_id: "selected",
    audio_url: "https://example.com/selected.mp3",
  });
  const otherResult = makeSong({ song_id: "other-result" });
  const store = createTestStore({
    homepage: { user: makeUser() },
    audioplayer: { viewingSongList: { selected, "other-result": otherResult } },
  });
  const wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );
  const hook = renderHook(useSearchPlayback, { wrapper });
  return { store, selected, ...hook };
};

test("selecting a search track starts immediately and adds random songs without changing search results", async () => {
  const pending = deferred<{
    data: { randomSongs: ReturnType<typeof makeSong>[] };
  }>();
  vi.mocked(axios.post).mockReturnValueOnce(pending.promise);
  const { store, selected } = setup();
  act(() => {
    store.dispatch(
      startSearchPlayback({ song: selected, sessionId: "search-one" }),
    );
  });
  expect(store.getState().audioplayer.playingIndex).toBe("selected");
  expect(
    Object.keys(store.getState().audioplayer.playingSongList ?? {}),
  ).toEqual(["selected"]);
  await act(async () =>
    pending.resolve({
      data: {
        randomSongs: [
          makeSong({ song_id: "random" }),
          makeSong({ song_id: "selected", audio_url: "wrong.mp3" }),
        ],
      },
    }),
  );
  expect(
    Object.keys(store.getState().audioplayer.playingSongList ?? {}),
  ).toEqual(["selected", "random"]);
  expect(store.getState().audioplayer.playingSongList?.selected.audio_url).toBe(
    selected.audio_url,
  );
  expect(
    Object.keys(store.getState().audioplayer.viewingSongList ?? {}),
  ).toEqual(["selected", "other-result"]);
});

test("the random queue refreshes after twenty track changes and retains the current track", async () => {
  const refresh = deferred<{
    data: { randomSongs: ReturnType<typeof makeSong>[] };
  }>();
  vi.mocked(axios.post)
    .mockResolvedValueOnce({
      data: {
        randomSongs: [
          makeSong({ song_id: "random-one" }),
          makeSong({ song_id: "random-two" }),
        ],
      },
    })
    .mockReturnValueOnce(refresh.promise);
  const { store, selected } = setup();
  act(() => {
    store.dispatch(
      startSearchPlayback({ song: selected, sessionId: "search-one" }),
    );
  });
  await waitFor(() =>
    expect(store.getState().audioplayer.playingSongList).toHaveProperty(
      "random-two",
    ),
  );
  act(() => {
    for (let index = 0; index < 19; index++) store.dispatch(playNext());
  });
  expect(axios.post).toHaveBeenCalledTimes(1);
  act(() => {
    store.dispatch(playNext());
  });
  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(2));
  const currentId = store.getState().audioplayer.playingIndex;
  const current =
    store.getState().audioplayer.playingSongList?.[currentId ?? ""];
  await act(async () =>
    refresh.resolve({
      data: { randomSongs: [makeSong({ song_id: "fresh" })] },
    }),
  );
  expect(store.getState().audioplayer.playingIndex).toBe(currentId);
  expect(
    store.getState().audioplayer.playingSongList?.[currentId ?? ""],
  ).toEqual(current);
  expect(
    Object.keys(store.getState().audioplayer.playingSongList ?? {}),
  ).toEqual([currentId, "fresh"]);
});

test("newer search selections and playlist playback cannot be overwritten by old random responses", async () => {
  const old = deferred<{
    data: { randomSongs: ReturnType<typeof makeSong>[] };
  }>();
  const latest = deferred<{
    data: { randomSongs: ReturnType<typeof makeSong>[] };
  }>();
  vi.mocked(axios.post)
    .mockReturnValueOnce(old.promise)
    .mockReturnValueOnce(latest.promise);
  const { store, selected } = setup();
  act(() => {
    store.dispatch(startSearchPlayback({ song: selected, sessionId: "old" }));
  });
  const oldSignal = vi.mocked(axios.post).mock.calls[0][2]?.signal;
  act(() => {
    store.dispatch(
      startSearchPlayback({
        song: makeSong({ song_id: "new" }),
        sessionId: "new",
      }),
    );
  });
  expect(oldSignal?.aborted).toBe(true);
  await act(async () =>
    old.resolve({ data: { randomSongs: [makeSong({ song_id: "stale" })] } }),
  );
  expect(store.getState().audioplayer.playingIndex).toBe("new");
  expect(store.getState().audioplayer.playingSongList).not.toHaveProperty(
    "stale",
  );
  act(() => {
    store.dispatch(playSong("other-result"));
  });
  await act(async () =>
    latest.resolve({ data: { randomSongs: [makeSong({ song_id: "late" })] } }),
  );
  expect(store.getState().audioplayer.searchPlayback).toBeNull();
  expect(store.getState().audioplayer.playingIndex).toBe("other-result");
  expect(store.getState().audioplayer.playingSongList).not.toHaveProperty(
    "late",
  );
});

test("browsing and renaming do not refresh or replace the active search queue", async () => {
  vi.mocked(axios.post).mockResolvedValueOnce({
    data: { randomSongs: [makeSong({ song_id: "random" })] },
  });
  const { store, selected } = setup();
  act(() => {
    store.dispatch(
      startSearchPlayback({ song: selected, sessionId: "search" }),
    );
  });
  await waitFor(() =>
    expect(store.getState().audioplayer.playingSongList).toHaveProperty(
      "random",
    ),
  );
  act(() => {
    store.dispatch(setViewingSongList(null));
    store.dispatch(
      renameViewingSong({ songId: "selected", newTitle: "Renamed" }),
    );
  });
  expect(axios.post).toHaveBeenCalledTimes(1);
  expect(store.getState().audioplayer.playingSongList?.selected.title).toBe(
    "Renamed",
  );
  expect(store.getState().audioplayer.playingSongList).toHaveProperty("random");
});

test("a failed random fetch leaves the selected song available to play", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(axios.post).mockRejectedValueOnce(new Error("offline"));
  const { store, selected } = setup();
  act(() => {
    store.dispatch(
      startSearchPlayback({ song: selected, sessionId: "search" }),
    );
  });
  await waitFor(() => expect(console.error).toHaveBeenCalled());
  expect(store.getState().audioplayer.playingIndex).toBe("selected");
  expect(store.getState().audioplayer.playingSongList?.selected).toEqual(
    selected,
  );
});
