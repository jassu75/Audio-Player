import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import styles from "./expandedPlayer.module.css";
import { formatTime } from "../../utils/audioPlayer.utils.js";
import { useSelector } from "react-redux";
import { currentSongSelector } from "../../../../redux/selectors/audioPlayerSelectors.js";
import CloseIcon from "@mui/icons-material/Close";

const ExpandedPlayer = ({ audioPlayerProps }) => {
  const song = useSelector(currentSongSelector);
  const {
    isPlaying,
    progress,
    duration,
    handlePlayPrevious,
    handleTogglePlay,
    handlePlayNext,
    handleSliderChange,
    handleClose,
  } = audioPlayerProps;

  return (
    <Grid className={styles.container}>
      <Grid className={styles.content} direction={"column"} container>
        <Grid className={styles.header}>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid className={styles.cover}>
          <img
            loading="lazy"
            src={song.cover_art}
            alt={song.title ?? ""}
            className={styles.cover_image}
          />
        </Grid>

        <Grid className={styles.song_info}>
          <Typography className={styles.title}>{song.title}</Typography>
          <Typography className={styles.artist}>{song.artist}</Typography>
        </Grid>

        <Grid className={styles.controls}>
          <IconButton
            onClick={handlePlayPrevious}
            className={styles.skip_button}
          >
            <SkipPreviousIcon />
          </IconButton>

          <IconButton onClick={handleTogglePlay} className={styles.play_button}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>

          <IconButton onClick={handlePlayNext} className={styles.skip_button}>
            <SkipNextIcon />
          </IconButton>
        </Grid>

        <Grid className={styles.progress_bar}>
          <Typography className={styles.time}>{formatTime(progress)}</Typography>

          <Slider
            size="small"
            value={progress}
            min={0}
            max={duration || 100}
            onChange={handleSliderChange}
            className={styles.slider}
          />

          <Typography className={styles.time}>{formatTime(duration)}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ExpandedPlayer;
