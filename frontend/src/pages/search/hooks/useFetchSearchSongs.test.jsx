import React, { act } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { renderHook } from "@testing-library/react";
import axios from "axios";
import homepage from "../../../redux/slices/homepageSlice";
import audioplayer from "../../../redux/slices/audioPlayerSlice";
import useFetchSearchSongs from "./useFetchSearchSongs";

jest.mock("axios", () => ({ post: jest.fn() }));

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test("a slower old search cannot replace a newer search or cleared history view", async () => {
  const pending = [];
  axios.post.mockImplementation(() => new Promise((resolve) => pending.push(resolve)));
  const store = configureStore({ reducer: { homepage, audioplayer }, preloadedState: {
    homepage: { user: { user_id: "u1" }, playlistCollection: [] },
    audioplayer: { viewingSongList: null, playingSongList: null, playingIndex: null },
  } });
  const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
  const { result, rerender } = renderHook(({ query }) => useFetchSearchSongs(query), { wrapper, initialProps: { query: "old" } });
  act(() => jest.advanceTimersByTime(300));
  rerender({ query: "new" });
  act(() => jest.advanceTimersByTime(300));
  await act(async () => pending[1]({ data: { searchResults: [{ song_id: "new" }] } }));
  await act(async () => pending[0]({ data: { searchResults: [{ song_id: "old" }] } }));
  expect(Object.keys(store.getState().audioplayer.viewingSongList)).toEqual(["new"]);
  rerender({ query: "   " });
  expect(result.current.showRecentlyPlayed).toBe(true);
  expect(result.current.showEmpty).toBe(false);
});
