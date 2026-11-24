import { renderHook } from "@testing-library/react";
import axios from "axios";
import React, { act } from "react";
import { Provider } from "react-redux";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import {
  createTestStore,
  deferred,
  makeSong,
  makeUser,
} from "../../../test/fixtures";
import type { Song } from "../../../components/playlist/playlist-songs-list/playlist-song/types/song.types";
import useFetchSearchSongs from "./useFetchSearchSongs";
vi.mock("axios", () => ({ default: { post: vi.fn() } }));
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());
test("a slower old search cannot replace a newer search or cleared history view", async () => {
  const pending: ReturnType<
    typeof deferred<{
      data: {
        searchResults: Song[];
      };
    }>
  >[] = [];
  vi.mocked(axios.post).mockImplementation(() => {
    const request = deferred<{
      data: {
        searchResults: Song[];
      };
    }>();
    pending.push(request);
    return request.promise;
  });
  const store = createTestStore({
    homepage: { user: makeUser(), playlistCollection: [] },
    audioplayer: {
      viewingSongList: null,
      playingSongList: null,
      playingIndex: null,
    },
  });
  const wrapper = ({ children }: React.PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );
  const { result, rerender } = renderHook(
    ({ query }) => useFetchSearchSongs(query),
    { wrapper, initialProps: { query: "old" } },
  );
  act(() => vi.advanceTimersByTime(300));
  rerender({ query: "new" });
  act(() => vi.advanceTimersByTime(300));
  await act(async () =>
    pending[1].resolve({
      data: { searchResults: [makeSong({ song_id: "new" })] },
    }),
  );
  await act(async () =>
    pending[0].resolve({
      data: { searchResults: [makeSong({ song_id: "old" })] },
    }),
  );
  expect(
    Object.keys(store.getState().audioplayer.viewingSongList ?? {}),
  ).toEqual(["new"]);
  rerender({ query: "   " });
  expect(result.current.showRecentlyPlayed).toBe(true);
  expect(result.current.showEmpty).toBe(false);
});
