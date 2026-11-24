import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import { useAppSelector } from "../../../../redux/hooks";
import { currentSongSelector } from "../../../../redux/selectors/audioPlayerSelectors";
import { formatTime } from "../../utils/audioPlayer.utils";
import type { MaxPlayerProps } from "./types/MaxPlayer.types";
import styles from "./maxPlayer.module.css";
import SongCover from "../../../helpers/song-cover/SongCover";

const MaxPlayer = ({ audioPlayerProps }: MaxPlayerProps) => {
  const song = useAppSelector(currentSongSelector);
  const {
    isPlaying,
    isBuffering,
    playbackError,
    progress,
    duration,
    handleTogglePlay,
    handlePlayNext,
    handlePlayPrevious,
    handleSliderChange,
    isExpanded,
    handleCollapse,
    handleClose,
  } = audioPlayerProps;
  if (!song) return null;
  return (
    <Dialog
      open={isExpanded}
      onClose={handleCollapse}
      fullScreen
      aria-labelledby="mobile-player-title"
      slotProps={{ paper: { className: styles.container } }}
    >
      <header className={styles.header}>
        <IconButton onClick={handleCollapse} aria-label="Collapse player">
          <KeyboardArrowDownIcon />
        </IconButton>
        <span className={styles.caption}>NOW PLAYING</span>
        <IconButton onClick={handleClose} aria-label="Stop playback">
          <CloseIcon />
        </IconButton>
      </header>
      <div className={styles.player_body}>
        <div className={styles.cover}>
          <SongCover
            src={song.cover_art}
            alt={song.album ? "Cover for " + song.album : "Track artwork"}
            className={styles.cover_image}
          />
        </div>
        <div className={styles.song_info}>
          <h2 id="mobile-player-title" className={styles.title}>
            {song.title}
          </h2>
          <p className={styles.artist}>{song.artist || "Unknown artist"}</p>
        </div>
        <div className={styles.progress_bar}>
          <Slider
            aria-label="Playback position"
            value={Math.min(progress, duration || 1)}
            min={0}
            max={duration || 1}
            disabled={!duration}
            onChange={handleSliderChange}
            getAriaValueText={formatTime}
            className={styles.slider}
          />
          <div className={styles.times}>
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className={styles.controls}>
          <IconButton
            onClick={handlePlayPrevious}
            aria-label="Previous track"
            className={styles.skip_button}
          >
            <SkipPreviousIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            aria-busy={isBuffering}
            className={styles.play_button}
          >
            {isBuffering ? (
              <CircularProgress size={30} color="inherit" />
            ) : isPlaying ? (
              <PauseIcon fontSize="large" />
            ) : (
              <PlayArrowIcon fontSize="large" />
            )}
          </IconButton>
          <IconButton
            onClick={handlePlayNext}
            aria-label="Next track"
            className={styles.skip_button}
          >
            <SkipNextIcon fontSize="large" />
          </IconButton>
        </div>
        <p className={styles.status} role="status" aria-live="polite">
          {playbackError || (isBuffering ? "Buffering…" : "")}
        </p>
      </div>
    </Dialog>
  );
};

export default MaxPlayer;
