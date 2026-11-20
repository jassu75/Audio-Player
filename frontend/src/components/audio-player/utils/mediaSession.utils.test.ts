import { fireEvent } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { makeSong } from "../../../test/fixtures";
import { connectMediaSession } from "./mediaSession.utils";

afterEach(() => vi.unstubAllGlobals());

const setup = () => {
  const actions = new Map<MediaSessionAction, MediaSessionActionHandler | null>();
  const session = {
    metadata: null as MediaMetadata | null,
    playbackState: "none" as MediaSessionPlaybackState,
    setActionHandler: vi.fn((action: MediaSessionAction, handler: MediaSessionActionHandler | null) => actions.set(action, handler)),
    setPositionState: vi.fn(),
  };
  vi.stubGlobal("navigator", { mediaSession: session });
  vi.stubGlobal("MediaMetadata", class {
    constructor(data: MediaMetadataInit) { Object.assign(this, data); }
  });
  const audio = document.createElement("audio");
  Object.defineProperty(audio, "duration", { configurable: true, value: 120 });
  audio.currentTime = 50;
  const controls = { play: vi.fn(), pause: vi.fn(), next: vi.fn(), previous: vi.fn(), stop: vi.fn() };
  return { session, audio, actions, controls };
};

test("publishes artwork and routes phone controls to playback", () => {
  const { session, audio, actions, controls } = setup();
  const connection = connectMediaSession(audio, controls);
  connection.setTrack(makeSong({ title: "Phone track", artist: "Artist" }));
  expect(session.metadata?.title).toBe("Phone track");
  expect(session.metadata?.artist).toBe("Artist");
  for (const [action, handler] of [["play", controls.play], ["pause", controls.pause], ["nexttrack", controls.next], ["previoustrack", controls.previous], ["stop", controls.stop]] as const) {
    actions.get(action)?.({ action });
    expect(handler).toHaveBeenCalledTimes(1);
  }
  fireEvent.play(audio);
  expect(session.playbackState).toBe("playing");
  fireEvent.pause(audio);
  expect(session.playbackState).toBe("paused");
  connection.dispose();
  expect(session.metadata).toBeNull();
  expect(session.playbackState).toBe("none");
  expect([...actions.values()].every(handler => handler === null)).toBe(true);
});

test("clamps lock-screen seeks and reports a valid position", () => {
  const { session, audio, actions, controls } = setup();
  const connection = connectMediaSession(audio, controls);
  actions.get("seekforward")?.({ action: "seekforward", seekOffset: 1000 });
  expect(audio.currentTime).toBe(120);
  actions.get("seekbackward")?.({ action: "seekbackward", seekOffset: 1000 });
  expect(audio.currentTime).toBe(0);
  actions.get("seekto")?.({ action: "seekto", seekTime: 35 });
  expect(session.setPositionState).toHaveBeenLastCalledWith({ duration: 120, position: 35, playbackRate: 1 });
  connection.dispose();
});

test("an unsupported phone action does not prevent other actions from working", () => {
  const { session, audio, actions, controls } = setup();
  session.setActionHandler.mockImplementation((action, handler) => {
    if (action === "seekto") throw new DOMException("Unsupported", "NotSupportedError");
    return actions.set(action, handler);
  });
  const connection = connectMediaSession(audio, controls);
  actions.get("play")?.({ action: "play" });
  expect(controls.play).toHaveBeenCalledTimes(1);
  expect(() => connection.dispose()).not.toThrow();
});

test("playback remains available without Media Session support", () => {
  const { audio, controls } = setup();
  vi.stubGlobal("navigator", {});
  const connection = connectMediaSession(audio, controls);
  expect(() => connection.setTrack(makeSong())).not.toThrow();
  expect(() => connection.dispose()).not.toThrow();
});
