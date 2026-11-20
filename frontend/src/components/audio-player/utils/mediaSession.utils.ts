import type { MediaSessionConnection, MediaSessionControls } from "./types/mediaSession.types";

export const connectMediaSession = (audio: HTMLAudioElement, controls: MediaSessionControls): MediaSessionConnection => {
  if (!("mediaSession" in navigator)) return { setTrack: () => undefined, dispose: () => undefined };
  const session = navigator.mediaSession;
  const updatePosition = () => {
    if (!session.setPositionState) return;
    try {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
        session.setPositionState();
        return;
      }
      session.setPositionState({
        duration: audio.duration,
        position: Math.min(audio.duration, Math.max(0, audio.currentTime)),
        playbackRate: audio.playbackRate > 0 ? audio.playbackRate : 1,
      });
    } catch {
      return;
    }
  };
  const seek = (position: number) => {
    if (!Number.isFinite(position) || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    audio.currentTime = Math.min(audio.duration, Math.max(0, position));
    updatePosition();
  };
  const handlers: Partial<Record<MediaSessionAction, MediaSessionActionHandler>> = {
    play: controls.play,
    pause: controls.pause,
    nexttrack: controls.next,
    previoustrack: controls.previous,
    stop: controls.stop,
    seekbackward: details => seek(audio.currentTime - (details.seekOffset ?? 10)),
    seekforward: details => seek(audio.currentTime + (details.seekOffset ?? 10)),
    seekto: details => { if (details.seekTime !== undefined) seek(details.seekTime); },
  };
  const registered: MediaSessionAction[] = [];
  for (const action of Object.keys(handlers) as MediaSessionAction[]) {
    try {
      session.setActionHandler(action, handlers[action] ?? null);
      registered.push(action);
    } catch {
      continue;
    }
  }
  const onPlay = () => { session.playbackState = "playing"; updatePosition(); };
  const onPause = () => { session.playbackState = "paused"; updatePosition(); };
  const onEmpty = () => { session.playbackState = "none"; updatePosition(); };
  const listeners = { play: onPlay, playing: onPlay, pause: onPause, ended: onPause, emptied: onEmpty, timeupdate: updatePosition, loadedmetadata: updatePosition, durationchange: updatePosition, ratechange: updatePosition, seeked: updatePosition };
  Object.entries(listeners).forEach(([event, listener]) => audio.addEventListener(event, listener));
  return {
    setTrack(song) {
      if (!song) {
        session.metadata = null;
        session.playbackState = "none";
      } else if (typeof MediaMetadata !== "undefined") {
        let artwork = new URL("/icons/icon-512.png", window.location.origin).href;
        try { artwork = new URL(song.cover_art || artwork, window.location.href).href; }
        catch { artwork = new URL("/icons/icon-512.png", window.location.origin).href; }
        session.metadata = new MediaMetadata({ title: song.title, artist: song.artist, album: song.album, artwork: [{ src: artwork }] });
      }
      updatePosition();
    },
    dispose() {
      Object.entries(listeners).forEach(([event, listener]) => audio.removeEventListener(event, listener));
      for (const action of registered) {
        try { session.setActionHandler(action, null); }
        catch { continue; }
      }
      session.metadata = null;
      session.playbackState = "none";
      if (session.setPositionState) {
        try { session.setPositionState(); }
        catch { return; }
      }
    },
  };
};
