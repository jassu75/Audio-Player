import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recentlyPlayedSelector } from "../redux/selectors/userPreferences.selector";
import { currentSongSelector } from "../redux/selectors/homepage.selector";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import styles from "./audioplayer.module.css";

const Audioplayer = () => {
  const dispatch = useDispatch();
  const recentlyPlayed = useSelector(recentlyPlayedSelector);
  const song = useSelector(currentSongSelector);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

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
  }, [song]);

  const togglePlay = async () => {
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

  const handleSeek = (_, val) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = val;
    setProgress(val);
  };

  const fmt = (s) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  if (!song) return null;

  return (
    <Grid className={styles.audioplayer_container}>
      <audio ref={audioRef} />

      <div className={styles.audioplayer_content}>
        <Grid className={styles.logo_container}>
          <img
            loading="lazy"
            src={song?.cover_art}
            alt={song?.title ?? ""}
            className={styles.logo}
          />
        </Grid>

        <Grid className={styles.song_info_container}>
          <Typography className={styles.title_text}>{song?.title}</Typography>
          <Typography className={styles.artist_text}>{song?.artist}</Typography>
        </Grid>

        <Grid className={styles.controls_container}>
          <IconButton className={styles.arrow_button} size="small">
            <SkipPreviousIcon />
          </IconButton>
          <IconButton onClick={togglePlay} className={styles.play_button}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton className={styles.arrow_button} size="small">
            <SkipNextIcon />
          </IconButton>
        </Grid>

        <Grid className={styles.progress_bar}>
          <Typography className={styles.time}>{fmt(progress)}</Typography>
          <Slider
            size="small"
            value={progress}
            min={0}
            max={duration || 100}
            onChange={handleSeek}
            className={styles.slider}
          />
          <Typography className={styles.time}>{fmt(duration)}</Typography>
        </Grid>
      </div>
    </Grid>
  );
};

export default Audioplayer;
