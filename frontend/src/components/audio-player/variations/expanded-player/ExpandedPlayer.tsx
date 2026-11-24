import CloseIcon from "@mui/icons-material/Close";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../../../../redux/hooks";
import { currentSongSelector } from "../../../../redux/selectors/audioPlayerSelectors";
import type { ExpandedPlayerProps } from "./types/ExpandedPlayer.types";
import { formatTime } from "../../utils/audioPlayer.utils";
import styles from "./expandedPlayer.module.css";
import SongCover from "../../../helpers/song-cover/SongCover";
import ShuffleButton from "../../shuffle-button/ShuffleButton";
const ExpandedPlayer = ({ audioPlayerProps }: ExpandedPlayerProps) => {
  const song = useAppSelector(currentSongSelector);
  const {
    isPlaying,
    isShuffling,
    handleToggleShuffle,
    playbackError,
    progress,
    duration,
    handlePlayPrevious,
    handleTogglePlay,
    handlePlayNext,
    handleSliderChange,
    handleClose,
  } = audioPlayerProps;
  if (!song) return null;
  return (
    <Grid className={styles.container}>
      <Grid
        className={styles.content}
        sx={{ flexDirection: "column" }}
        container
      >
        <Grid className={styles.header}>
          <IconButton onClick={handleClose} aria-label="Stop playback">
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid className={styles.cover}>
          <SongCover
            loading="lazy"
            src={song.cover_art}
            alt={song.title ?? ""}
            className={styles.cover_image}
          />
        </Grid>

        <Grid className={styles.song_info}>
          <div className={styles.song_details}>
            <Typography className={styles.title}>{song.title}</Typography>
            <Typography className={styles.artist}>{song.artist}</Typography>
          </div>
          <ShuffleButton enabled={isShuffling} onClick={handleToggleShuffle} />
        </Grid>

        <Grid className={styles.controls}>
          <IconButton
            onClick={handlePlayPrevious}
            aria-label="Previous track"
            className={styles.skip_button}
          >
            <SkipPreviousIcon />
          </IconButton>

          <IconButton
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className={styles.play_button}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>

          <IconButton
            onClick={handlePlayNext}
            aria-label="Next track"
            className={styles.skip_button}
          >
            <SkipNextIcon />
          </IconButton>
        </Grid>

        <Grid className={styles.progress_bar}>
          <Typography className={styles.time}>
            {formatTime(progress)}
          </Typography>

          <Slider
            aria-label="Playback position"
            disabled={!duration}
            size="small"
            value={Math.min(progress, duration || 1)}
            min={0}
            max={duration || 1}
            onChange={handleSliderChange}
            className={styles.slider}
          />

          <Typography className={styles.time}>
            {formatTime(duration)}
          </Typography>
        </Grid>
        {playbackError && (
          <Typography role="status" color="error">
            {playbackError}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};
export default ExpandedPlayer;
