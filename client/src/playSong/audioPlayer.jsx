import { useState, useRef, useEffect } from "react";
import styles from "./audioPlayer.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { PlayArrow, Pause, SkipNext, SkipPrevious } from "@mui/icons-material";
import useFetchUserDetails from "../hooks/useFetchUserDetails";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import ErrorPage from "../HelperPages/ErrorPages/ErrorPage";
import AudioPlayerSkeleton from "../Skeletons/AudioPlayerSkeleton";
import {
  songsSelector,
  userSelector,
} from "../redux/selectors/homepage.selector";
import {
  addListens,
  addRecentlyPlayed,
  setListens,
} from "../redux/slices/userPreferences.slice";
import useUpdateUserPreference from "../hooks/UserPrefs/useUpdateUserPreferences";
import axios from "axios";
import { setSongs } from "../redux/slices/homepage.slice";
import useFetchRecentlyPlayed from "../hooks/UserPrefs/useFetchRecentlyPlayed";
import { recentlyPlayedSelector } from "../redux/selectors/userPreferences.selector";

const AudioPlayer = () => {
  const { userLoading, userError } = useFetchUserDetails();
  const { songId } = useParams();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const user = useSelector(userSelector);
  const songsList = useSelector(songsSelector);
  const song = songsList?.[songId];
  const recentlyPlayed = useSelector(recentlyPlayedSelector);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const navigate = useNavigate();

  const { recentlyPlayedLoading } = useFetchRecentlyPlayed();
  useUpdateUserPreference();

  const audioPlayer = useRef(); // Reference to the audio component
  const progressBar = useRef(); // Reference to the progress bar
  const animationRef = useRef(); // Reference to the animation

  useEffect(() => {
    const player = audioPlayer.current;

    if (player) {
      const updateDuration = () => {
        if (!isNaN(player.duration)) {
          const duration = Math.floor(player.duration);
          setSongDuration(duration);
          progressBar.current.max = duration;
        }
      };

      updateDuration();

      const handleEnded = () => {
        const songIds = Object.keys(songsList);
        let nextSongId;
        do {
          nextSongId = songIds[Math.floor(Math.random() * songIds.length)];
        } while (nextSongId === songId && songIds.length > 1);

        const nextSong = songsList[nextSongId];
        player.src = nextSong.audio_url;
        const playNextSong = () => {
          player.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
        };

        player.addEventListener("canplaythrough", playNextSong, { once: true });
        setCount((prev) => prev + 1);
        navigate(`/user/song/${nextSongId}`, { replace: true });
        resetProgressBar();
      };

      player.addEventListener("ended", handleEnded);

      return () => {
        player.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioPlayer, navigate, songId, songsList]);

  useEffect(() => {
    const fetchRandomSongs = async () => {
      try {
        const response = await axios.post(
          "/api/fetchrandomsongs",
          { user_id: user.user_id },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const refinedResponse = response.data?.randomSongs.reduce(
          (acc, song) => {
            acc[song.song_id] = song;
            return acc;
          },
          {}
        );
        dispatch(setSongs(refinedResponse));
        setCount(1);
      } catch (err) {
        console.error("error fetching random songs", err);
      }
    };

    if (user && count % 20 === 0) {
      fetchRandomSongs();
    }
  }, [count, dispatch, user]);

  useEffect(() => {
    return () => {
      dispatch(setSongs(null));
    };
  }, [dispatch]);

  useEffect(() => {
    if (song && user && recentlyPlayed) {
      dispatch(addRecentlyPlayed(song));
      dispatch(addListens(songId));
    }
  }, [dispatch, song, songId, user]);

  useEffect(() => {
    return () => {
      dispatch(setListens(null));
    };
  }, [dispatch]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    if (audioPlayer.current) {
      progressBar.current.value = audioPlayer.current.currentTime;
      changePlayerCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar?.current?.value;
    changePlayerCurrentTime();
  };

  const resetProgressBar = () => {
    setCurrentTime(0);
    progressBar.current.value = 0;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / songDuration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  const backButton = () => {
    const songIds = Object.keys(songsList);
    const currentIndex = songIds.indexOf(songId);
    const prevIndex = (currentIndex - 1 + songIds.length) % songIds.length;
    const prevSongId = songIds[prevIndex];

    setIsPlaying(false);
    setCount((prev) => prev + 1);

    navigate(`/user/song/${prevSongId}`, { replace: true });
    resetProgressBar();
  };

  const forwardButton = () => {
    const songIds = Object.keys(songsList);
    const currentIndex = songIds.indexOf(songId);
    const nextIndex = (currentIndex + 1) % songIds.length;
    const nextSongId = songIds[nextIndex];

    setIsPlaying(false);
    setCount((prev) => prev + 1);

    navigate(`/user/song/${nextSongId}`, { replace: true });
    resetProgressBar();
  };

  if (userLoading || recentlyPlayedLoading || !songsList) {
    return <AudioPlayerSkeleton />;
  }

  if (userError) {
    return <ErrorPage />;
  }

  return (
    <Grid2 className={styles.audioPlayer}>
      <img
        loading="lazy"
        src={song?.cover_art}
        alt=""
        className={styles.song_image}
      />
      <Grid2 className={styles.song_content}>
        <Grid2 className={styles.song_details}>
          <Grid2 className={styles.song_title}>
            <Typography variant="audioPlayerSongTitle">
              {song?.title}
            </Typography>
          </Grid2>
          <Grid2 className={styles.song_artist}>
            <Typography variant="audioPlayerSongArtist">
              {song?.artist}
            </Typography>
          </Grid2>
        </Grid2>
      </Grid2>

      <Grid2 className={styles.audio_buttons}>
        <audio
          ref={audioPlayer}
          src={song?.audio_url}
          preload="metadata"
          onLoadedMetadata={() => {
            const duration = Math.floor(audioPlayer.current?.duration || 0);
            setSongDuration(duration);
            progressBar.current.max = duration;
          }}
        ></audio>
        <button className={styles.forwardBackward} onClick={backButton}>
          <SkipPrevious />
        </button>
        <button onClick={togglePlayPause} className={styles.playPause}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </button>
        <button className={styles.forwardBackward} onClick={forwardButton}>
          <SkipNext />
        </button>
      </Grid2>
      <Grid2 className={styles.progress_bar_and_time}>
        <Grid2 className={styles.currentTime}>
          <Typography variant="AudioPlayerCurrentTimeAndDuration">
            {calculateTime(currentTime)}
          </Typography>
        </Grid2>
        <Grid2>
          <input
            type="range"
            className={styles.progressBar}
            defaultValue="0"
            ref={progressBar}
            onChange={changeRange}
          />
        </Grid2>
        <Grid2 className={styles.duration}>
          {songDuration > 0 && (
            <Typography variant="AudioPlayerCurrentTimeAndDuration">
              {calculateTime(songDuration)}
            </Typography>
          )}
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default AudioPlayer;
