import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppStore } from "../../../redux/hooks";
import { currentSongSelector } from "../../../redux/selectors/audioPlayerSelectors";
import { clearPlayingContext, playNext, playPrevious } from "../../../redux/slices/audioPlayerSlice";
import { connectMediaSession } from "../utils/mediaSession.utils";
import { userSelector } from "../../../redux/selectors/homepageSelectors";
import { addListens, addRecentlyPlayed } from "../../../redux/slices/userPreferencesSlice";
import { recordPlayEvent } from "../../../services/listeningHistory";
import useSearchPlayback from "./useSearchPlayback";

const useAudioPlayer = () => {
  useSearchPlayback();
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceVersion = useRef(0);
  const recordedVersion = useRef<number | null>(null);
  const mounted = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackError, setPlaybackError] = useState("");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio?.getAttribute("src")) return;
    const version = sourceVersion.current;
    setPlaybackError("");
    audio.play().then(() => {
      if (mounted.current && sourceVersion.current === version) setIsPlaying(true);
    }).catch((error: unknown) => {
      if (!mounted.current || sourceVersion.current !== version || (error instanceof DOMException && error.name === "AbortError")) return;
      setIsPlaying(false);
      setIsBuffering(false);
      setPlaybackError(error instanceof DOMException && error.name === "NotAllowedError"
        ? "Tap Play to start listening."
        : "Unable to play this track. Check your connection and try again.");
    });
  }, []);

  const moveTrack = useCallback((direction: "next" | "previous") => {
    const audio = audioRef.current;
    const previous = currentSongSelector(store.getState());
    if (direction === "previous" && audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      play();
      return;
    }
    dispatch(direction === "next" ? playNext() : playPrevious());
    if (previous && currentSongSelector(store.getState())?.song_id === previous.song_id && audio) {
      recordedVersion.current = null;
      audio.currentTime = 0;
      play();
    }
  }, [dispatch, play, store]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    mounted.current = true;
    const onTimeUpdate = () => setProgress(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
    const onMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setIsBuffering(false);
    };
    const onPlay = () => { setIsPlaying(true); setPlaybackError(""); };
    const onPause = () => setIsPlaying(false);
    const onPlaying = () => {
      onPlay();
      setIsBuffering(false);
      const state = store.getState();
      const song = currentSongSelector(state);
      const user = userSelector(state);
      if (!song || !user || recordedVersion.current === sourceVersion.current) return;
      recordedVersion.current = sourceVersion.current;
      dispatch(addRecentlyPlayed(song));
      dispatch(addListens(song.song_id));
      void recordPlayEvent({ event_id: crypto.randomUUID(), song_id: song.song_id, user_id: user.user_id })
        .catch(error => console.error("Unable to save listening history", error));
    };
    const onWaiting = () => setIsBuffering(true);
    const onError = () => {
      setIsPlaying(false);
      setIsBuffering(false);
      setPlaybackError("Unable to play this track. Check your connection and try again.");
    };
    const onEnded = () => { recordedVersion.current = null; moveTrack("next"); };
    const listeners = { timeupdate: onTimeUpdate, loadedmetadata: onMetadata, durationchange: onMetadata, play: onPlay, playing: onPlaying, pause: onPause, waiting: onWaiting, stalled: onWaiting, canplay: onMetadata, ended: onEnded, error: onError };
    Object.entries(listeners).forEach(([event, listener]) => audio.addEventListener(event, listener));
    const mediaSession = connectMediaSession(audio, {
      play,
      pause: () => audio.pause(),
      next: () => moveTrack("next"),
      previous: () => moveTrack("previous"),
      stop: () => dispatch(clearPlayingContext()),
    });
    let activeKey: string | null = null;
    let previousSong: ReturnType<typeof currentSongSelector> | undefined;
    const syncTrack = () => {
      const song = currentSongSelector(store.getState());
      if (song !== previousSong) {
        previousSong = song;
        mediaSession.setTrack(song);
      }
      const key = song ? song.song_id + "\n" + song.audio_url : "";
      if (key === activeKey) return;
      if (activeKey) audio.pause();
      activeKey = key;
      sourceVersion.current++;
      setProgress(0);
      setIsPlaying(false);
      setIsBuffering(false);
      setPlaybackError("");
      setDuration(song?.duration ?? 0);
      if (!song) {
        if (audio.hasAttribute("src")) {
          audio.removeAttribute("src");
          audio.load();
        }
        return;
      }
      audio.src = song.audio_url;
      audio.load();
      play();
    };
    const unsubscribe = store.subscribe(syncTrack);
    syncTrack();
    return () => {
      mounted.current = false;
      unsubscribe();
      Object.entries(listeners).forEach(([event, listener]) => audio.removeEventListener(event, listener));
      audio.pause();
      mediaSession.dispose();
    };
  }, [dispatch, moveTrack, play, store]);

  const handleTogglePlay = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) audio.pause();
    else play();
  };
  const handlePlayNext = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    moveTrack("next");
  };
  const handlePlayPrevious = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    moveTrack("previous");
  };
  const handleSliderChange = (_: Event, value: number | number[]) => {
    const audio = audioRef.current;
    if (!audio || typeof value !== "number" || !Number.isFinite(value) || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const position = Math.min(audio.duration, Math.max(0, value));
    audio.currentTime = position;
    setProgress(position);
  };
  return {
    audioRef, isPlaying, isBuffering, playbackError, progress, duration, isExpanded,
    handleTogglePlay, handlePlayNext, handlePlayPrevious, handleSliderChange,
    handleExpand: () => setIsExpanded(true),
    handleCollapse: () => setIsExpanded(false),
    handleClose: () => dispatch(clearPlayingContext()),
  };
};

export default useAudioPlayer;
