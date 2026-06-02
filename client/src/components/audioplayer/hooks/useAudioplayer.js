import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  currentSongSelector,
  playingIndexSelector,
  playingSonglistSelector,
} from "../../../redux/selectors/audioplayer.selector";
import {
  setPlayingIndex,
  setPlayingSonglist,
} from "../../../redux/slices/audioplayer.slice";

const useAudioPlayer = () => {
  const dispatch = useDispatch();
  const song = useSelector(currentSongSelector);
  const playingSonglist = useSelector(playingSonglistSelector);
  const playingSonglistRef = useRef(playingSonglist);
  const playingIndex = useSelector(playingIndexSelector);
  const playingIndexRef = useRef(playingIndex);
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
    if (!audio || !song?.audio_url) return;

    setProgress(0);
    setIsPlaying(false);
    audio.src = song.audio_url;
    audio.load();

    if (
      playingSonglistRef.current === playingSonglist &&
      playingIndexRef.current === playingIndex
    )
      return;

    playingSonglistRef.current = playingSonglist;
    playingIndexRef.current = playingIndex;

    const onCanPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Error playing audio:", err);
      }
    };

    audio.addEventListener("canplay", onCanPlay, { once: true });

    return () => {
      audio.removeEventListener("canplay", onCanPlay);
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

  const handlePlayNext = () => {
    if (!playingSonglist) return;
    const keys = Object.keys(playingSonglist);
    const currentPos = keys.indexOf(String(playingIndex));
    dispatch(setPlayingIndex(keys[(currentPos + 1) % keys.length]));
  };

  const handlePlayPrevious = () => {
    if (!playingSonglist) return;
    const keys = Object.keys(playingSonglist);
    const currentPos = keys.indexOf(String(playingIndex));
    dispatch(
      setPlayingIndex(keys[(currentPos - 1 + keys.length) % keys.length]),
    );
  };

  const handleSliderChange = (_, val) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = val;
    setProgress(val);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };
  const handleCollapse = () => {
    setIsExpanded(false);
  };

  const handleClose = () => {
    dispatch(setPlayingSonglist(null));
    dispatch(setPlayingIndex(0));
  };

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
