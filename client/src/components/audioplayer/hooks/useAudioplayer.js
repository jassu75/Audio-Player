import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  currentSongSelector,
  playingIndexSelector,
  playingSonglistSelector,
} from "../../../redux/selectors/audioplayer.selector";
import {
  clearPlayingContext,
  playNext,
  playPrevious,
} from "../../../redux/slices/audioplayer.slice";

const useAudioPlayer = () => {
  const dispatch = useDispatch();
  const song = useSelector(currentSongSelector);
  const playingSonglist = useSelector(playingSonglistSelector);
  const playingIndex = useSelector(playingIndexSelector);

  const playingSonglistRef = useRef(null);
  const playingIndexRef = useRef(null);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (!playingSonglistRef.current) return;
      dispatch(playNext());
    };

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song?.audio_url) return;

    if (audio.src === song.audio_url) return;

    playingSonglistRef.current = playingSonglist;
    playingIndexRef.current = playingIndex;

    setProgress(0);
    setIsPlaying(false);

    const playAudio = async () => {
      try {
        audio.src = song.audio_url;
        await audio.load();
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Error playing audio:", err);
      }
    };

    playAudio();

    return () => {
      audio.pause();
    };
  }, [song, playingSonglist, playingIndex]);

  const handleTogglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Playback error:", err);
        }
      }
    }
  };

  const handlePlayNext = () => dispatch(playNext());
  const handlePlayPrevious = () => dispatch(playPrevious());

  const handleSliderChange = (_, val) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = val;
    setProgress(val);
  };

  const handleExpand = () => setIsExpanded(true);
  const handleCollapse = () => setIsExpanded(false);

  const handleClose = () => dispatch(clearPlayingContext());

  return {
    audioRef,
    isPlaying,
    progress,
    duration,
    handleTogglePlay,
    handlePlayNext,
    handlePlayPrevious,
    handleSliderChange,
    isExpanded,
    handleCollapse,
    handleExpand,
    handleClose,
  };
};

export default useAudioPlayer;
