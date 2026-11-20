import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { Provider } from "react-redux";
import { expect, test, vi } from "vitest";
import { playSong, renameViewingSong, setPlayingIndex, setViewingSongList } from "../../../redux/slices/audioPlayerSlice";
import { createTestStore, makeSong } from "../../../test/fixtures";
import useAudioPlayer from "./useAudioPlayer";
test("renaming a playing track leaves audio running; switching tracks loads the new source", async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => { });
    const load = vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => { });
    const song = makeSong();
    const store = createTestStore({ audioplayer: {
            viewingSongList: { s1: song },
            playingSongList: { s1: song, s2: makeSong({ song_id: "s2", audio_url: "https://example.com/two.mp3" }) },
            playingIndex: "s1",
        } });
    const Harness = () => {
        const { audioRef } = useAudioPlayer();
        return <audio ref={audioRef}/>;
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
    vi.restoreAllMocks();
});

test("track selection starts audio inside the user action and advances without waiting for React", async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
    const store = createTestStore({ audioplayer: { viewingSongList: {
        s1: makeSong(), s2: makeSong({ song_id: "s2", audio_url: "https://example.com/two.mp3" }),
    } } });
    let element: HTMLAudioElement | null = null;
    const Harness = () => {
        const { audioRef } = useAudioPlayer();
        return <audio ref={node => { audioRef.current = node; element = node; }} />;
    };
    const { unmount } = render(<Provider store={store}><Harness /></Provider>);
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
    vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValueOnce(new DOMException("Gesture required", "NotAllowedError")).mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
    const song = makeSong();
    const store = createTestStore({ audioplayer: { playingSongList: { s1: song }, playingIndex: "s1" } });
    const Harness = () => {
        const player = useAudioPlayer();
        return <><audio ref={player.audioRef} /><p role="status">{player.playbackError}</p><button onClick={player.handleTogglePlay}>{player.isPlaying ? "Pause" : "Play"}</button></>;
    };
    const { unmount } = render(<Provider store={store}><Harness /></Provider>);
    await screen.findByText("Tap Play to start listening.");
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    await screen.findByRole("button", { name: "Pause" });
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    unmount();
    vi.restoreAllMocks();
});
