import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { useAppSelector } from "../../../../redux/hooks";
import { currentSongSelector } from "../../../../redux/selectors/audioPlayerSelectors";
import type { MiniPlayerProps } from "./types/MiniPlayer.types";
import styles from "./miniPlayer.module.css";
import SongCover from "../../../helpers/song-cover/SongCover";

const MiniPlayer = ({ audioPlayerProps }: MiniPlayerProps) => {
  const {
    isPlaying,
    isBuffering,
    playbackError,
    progress,
    duration,
    handlePlayPrevious,
    handleTogglePlay,
    handlePlayNext,
    handleExpand,
  } = audioPlayerProps;
  const song = useAppSelector(currentSongSelector);
  if (!song) return null;
  const percentage =
    duration > 0 ? Math.min(100, Math.max(0, (progress / duration) * 100)) : 0;
  return (
    <section className={styles.container} aria-label="Audio player">
      <div className={styles.progress} aria-hidden="true">
        <div style={{ width: percentage + "%" }} />
      </div>
      <div className={styles.content}>
        <button
          type="button"
          className={styles.track}
          onClick={handleExpand}
          aria-label={"Open player for " + song.title}
        >
          <SongCover
            src={song.cover_art}
            alt=""
            className={styles.cover_image}
          />
          <span className={styles.song_info}>
            <span className={styles.title}>{song.title}</span>
            <span
              className={styles.artist}
              role={playbackError ? "status" : undefined}
            >
              {playbackError || song.artist || "Unknown artist"}
            </span>
          </span>
        </button>
        <div className={styles.controls}>
          <IconButton
            aria-label="Previous track"
            onClick={handlePlayPrevious}
            className={styles.skip_button}
          >
            <SkipPreviousIcon />
          </IconButton>
          <IconButton
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={handleTogglePlay}
            className={styles.play_button}
            aria-busy={isBuffering}
          >
            {isBuffering ? (
              <CircularProgress size={22} color="inherit" />
            ) : isPlaying ? (
              <PauseIcon />
            ) : (
              <PlayArrowIcon />
            )}
          </IconButton>
          <IconButton
            aria-label="Next track"
            onClick={handlePlayNext}
            className={styles.skip_button}
          >
            <SkipNextIcon />
          </IconButton>
        </div>
      </div>
    </section>
  );
};

export default MiniPlayer;
