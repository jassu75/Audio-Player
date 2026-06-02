import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

import styles from "./maxplayer.module.css";
import { fmt } from "../../utils/audioplayer.utils";
import { currentSongSelector } from "../../../../redux/selectors/audioplayer.selector";
import Grid from "@mui/material/Grid";

const Maxplayer = ({ audioplayerProps }) => {
  const song = useSelector(currentSongSelector);
  const {
    isPlaying,
    progress,
    duration,
    handleTogglePlay,
    handlePlayNext,
    handlePlayPrevious,
    handleSliderChange,
    isExpanded,
    handleCollapse,
    handleClose,
  } = audioplayerProps;

  return (
    <Grid
      className={`${styles.container} ${isExpanded ? styles.overlay_open : ""}`}
      direction={"column"}
      container
    >
      <Grid className={styles.header}>
        <IconButton onClick={handleCollapse} className={styles.down_button}>
          <KeyboardArrowDownIcon />
        </IconButton>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Grid>

      <Grid className={styles.cover}>
        <img
          src={song.cover_art}
          alt={song.title ?? ""}
          className={styles.cover_image}
        />
      </Grid>

      <Grid className={styles.song_info}>
        <Typography className={styles.title}>{song.title}</Typography>
        <Typography className={styles.artist}>{song.artist}</Typography>
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

      <Grid className={styles.controls}>
        <IconButton onClick={handlePlayPrevious} className={styles.skip_button}>
          <SkipPreviousIcon />
        </IconButton>

        <IconButton onClick={handleTogglePlay} className={styles.play_button}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        <IconButton onClick={handlePlayNext} className={styles.skip_button}>
          <SkipNextIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default Maxplayer;
