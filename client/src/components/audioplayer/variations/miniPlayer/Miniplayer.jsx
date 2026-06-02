import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import styles from "./miniplayer.module.css";
import { useSelector } from "react-redux";
import { currentSongSelector } from "../../../../redux/selectors/audioplayer.selector";
import Grid from "@mui/material/Grid";

const Miniplayer = ({ audioplayerProps, handleExpand }) => {
  const { isPlaying, handlePlayPrevious, handleTogglePlay, handlePlayNext } =
    audioplayerProps;

  const song = useSelector(currentSongSelector);

  return (
    <Grid className={styles.container} onClick={handleExpand}>
      <Grid className={styles.content}>
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
            size="small"
          >
            <SkipPreviousIcon />
          </IconButton>

          <IconButton onClick={handleTogglePlay} className={styles.play_button}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>

          <IconButton
            onClick={handlePlayNext}
            className={styles.skip_button}
            size="small"
          >
            <SkipNextIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Miniplayer;
