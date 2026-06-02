import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import styles from "./expandedplayer.module.css";
import { fmt } from "../../utils/audioplayer.utils";
import { useSelector } from "react-redux";
import { currentSongSelector } from "../../../../redux/selectors/audioplayer.selector";

const Expandedplayer = ({ audioplayerProps }) => {
  const song = useSelector(currentSongSelector);
  const {
    isPlaying,
    progress,
    duration,
    handlePlayPrevious,
    handleTogglePlay,
    handlePlayNext,
    handleSliderChange,
  } = audioplayerProps;

  return (
    <Grid className={styles.container}>
      <Grid className={styles.content}>
        <Grid className={styles.cover}>
          <img
            loading="lazy"
            src={song.cover_art}
            alt={song.title ?? ""}
            className={styles.coverImage}
          />
        </Grid>

        <Grid className={styles.songInfo}>
          <Typography className={styles.title}>{song.title}</Typography>
          <Typography className={styles.artist}>{song.artist}</Typography>
        </Grid>

        <Grid className={styles.controls}>
          <IconButton
            onClick={handlePlayPrevious}
            className={styles.skipButton}
          >
            <SkipPreviousIcon />
          </IconButton>

          <IconButton onClick={handleTogglePlay} className={styles.playButton}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>

          <IconButton onClick={handlePlayNext} className={styles.skipButton}>
            <SkipNextIcon />
          </IconButton>
        </Grid>

        <Grid className={styles.progressBar}>
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
      </Grid>
    </Grid>
  );
};

export default Expandedplayer;
