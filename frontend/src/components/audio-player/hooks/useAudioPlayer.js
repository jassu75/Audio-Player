import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { currentSongSelector } from "../../../redux/selectors/audioPlayerSelectors.js";
import { clearPlayingContext, playNext, playPrevious } from "../../../redux/slices/audioPlayerSlice.js";

const useAudioPlayer = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const song = useSelector(currentSongSelector);
  const songId = song?.song_id;
  const audioUrl = song?.audio_url;
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      const songs = store.getState().audioplayer.playingSongList;
      if (Object.keys(songs ?? {}).length === 1) {
        audio.currentTime = 0;
        audio.play().catch((error) => console.error("Error replaying audio", error));
      } else {
        dispatch(playNext());
      }
    };
    const listeners = { timeupdate: onTimeUpdate, loadedmetadata: onLoadedMetadata, play: onPlay, pause: onPause, ended: onEnded, error: onPause };
    Object.entries(listeners).forEach(([event, listener]) => audio.addEventListener(event, listener));
    return () => Object.entries(listeners).forEach(([event, listener]) => audio.removeEventListener(event, listener));
  }, [dispatch, store]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    let active = true;
    setProgress(0);
    setDuration(0);
    setIsPlaying(false);
    audio.src = audioUrl;
    audio.load();
    audio.play().then(() => {
      if (active) setIsPlaying(true);
    }).catch((error) => {
      if (active && error.name !== "AbortError") console.error("Error playing audio", error);
    });
    return () => {
      active = false;
      audio.pause();
    };
  }, [audioUrl, songId]);

  const handleTogglePlay = async (event) => {
    event.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) audio.pause();
    else {
      try { await audio.play(); }
      catch (error) { console.error("Playback error", error); }
    }
  };
  const handlePlayNext = (event) => {
    event.stopPropagation();
    dispatch(playNext());
  };
  const handlePlayPrevious = (event) => {
    event.stopPropagation();
    dispatch(playPrevious());
  };
  const handleSliderChange = (_, value) => {
    if (!audioRef.current || !Number.isFinite(value)) return;
    audioRef.current.currentTime = value;
    setProgress(value);
  };

  return {
    audioRef, isPlaying, progress, duration, isExpanded,
    handleTogglePlay, handlePlayNext, handlePlayPrevious, handleSliderChange,
    handleExpand: () => setIsExpanded(true),
    handleCollapse: () => setIsExpanded(false),
    handleClose: () => dispatch(clearPlayingContext()),
  };
};

export default useAudioPlayer;
