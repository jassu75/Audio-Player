import { useSelector } from "react-redux";
import { currentSongSelector } from "../redux/selectors/audioplayer.selector";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import styles from "./audioplayer.module.css";
import useAudioPlayer from "./helpers/useAudioplayer";
import { fmt } from "./helpers/audioplayer.utils";

const Audioplayer = () => {
  const song = useSelector(currentSongSelector);
  const {
    audioRef,
    isPlaying,
    progress,
    duration,
    handleTogglePlay,
    handlePlayNext,
    handlePlayPrevious,
    handleSliderChange,
  } = useAudioPlayer();

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
          <IconButton
            onClick={handlePlayPrevious}
            className={styles.arrow_button}
            size="small"
          >
            <SkipPreviousIcon />
          </IconButton>
          <IconButton onClick={handleTogglePlay} className={styles.play_button}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton
            onClick={handlePlayNext}
            className={styles.arrow_button}
            size="small"
          >
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
            onChange={handleSliderChange}
            className={styles.slider}
          />
          <Typography className={styles.time}>{fmt(duration)}</Typography>
        </Grid>
      </div>
    </Grid>
  );
};

export default Audioplayer;
