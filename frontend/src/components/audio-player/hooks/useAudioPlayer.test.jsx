import React, { act } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render, waitFor } from "@testing-library/react";
import useAudioPlayer from "./useAudioPlayer";
import audioPlayer, { renameViewingSong, setPlayingIndex } from "../../../redux/slices/audioPlayerSlice";

test("renaming a playing track leaves audio running; switching tracks loads the new source", async () => {
  const play = jest.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  const pause = jest.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  const load = jest.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  const song = { song_id: "s1", title: "Original", audio_url: "https://example.com/one.mp3" };
  const store = configureStore({ reducer: { audioplayer: audioPlayer }, preloadedState: { audioplayer: {
    viewingSongList: { s1: song },
    playingSongList: { s1: song, s2: { song_id: "s2", audio_url: "https://example.com/two.mp3" } },
    playingIndex: "s1",
  } } });
  const Harness = () => {
    const { audioRef } = useAudioPlayer();
    return <audio ref={audioRef} />;
  };
  const { unmount } = render(<Provider store={store}><Harness /></Provider>);
  await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
  act(() => store.dispatch(renameViewingSong({ songId: "s1", newTitle: "Renamed" })));
  expect(pause).not.toHaveBeenCalled();
  expect(load).toHaveBeenCalledTimes(1);
  act(() => store.dispatch(setPlayingIndex("s2")));
  await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
  expect(pause).toHaveBeenCalledTimes(1);
  unmount();
  jest.restoreAllMocks();
});
