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

  const audioPlayer = useRef();
  const progressBar = useRef();

  useEffect(() => {
    const player = audioPlayer.current;
    if (!player) return;

    const handleEnded = () => {
      const songIds = Object.keys(songsList);
      let nextSongId;

      do {
        nextSongId = songIds[Math.floor(Math.random() * songIds.length)];
      } while (nextSongId === songId && songIds.length > 1);

      setCount((prev) => prev + 1);
      navigate(`/user/song/${nextSongId}`, { replace: true });
      resetProgressBar();
    };

    player.addEventListener("ended", handleEnded);
    return () => player.removeEventListener("ended", handleEnded);
  }, [navigate, songId, songsList]);

  useEffect(() => {
    const player = audioPlayer.current;
    if (!player || !song) return;

    setCurrentTime(0);

    const handleCanPlay = () => {
      if (isPlaying) {
        player.play().catch(() => {});
      }
    };

    player.addEventListener("canplay", handleCanPlay);

    return () => {
      player.removeEventListener("canplay", handleCanPlay);
    };
  }, [song, isPlaying]);

  useEffect(() => {
    const fetchRandomSongs = async () => {
      try {
        const response = await axios.post(
          "/api/fetchrandomsongs",
          { user_id: user.user_id },
          {
            headers: { "Content-Type": "application/json" },
          },
        );

        const refinedResponse = response.data?.randomSongs.reduce(
          (acc, song) => {
            acc[song.song_id] = song;
            return acc;
          },
          {},
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
    return () => dispatch(setSongs(null));
  }, [dispatch]);

  useEffect(() => {
    if (song && user && recentlyPlayed) {
      dispatch(addRecentlyPlayed(song));
      dispatch(addListens(songId));
    }
  }, [dispatch, song, songId, user]);

  useEffect(() => {
    return () => dispatch(setListens(null));
  }, [dispatch]);

  useEffect(() => {
    const player = audioPlayer.current;
    if (!player) return;

    const updateTime = () => {
      if (progressBar.current) {
        progressBar.current.value = player.currentTime;
        progressBar.current.style.setProperty(
          "--seek-before-width",
          `${(player.currentTime / songDuration) * 100}%`,
        );
      }
      setCurrentTime(player.currentTime);
    };

    player.addEventListener("timeupdate", updateTime);
    return () => player.removeEventListener("timeupdate", updateTime);
  }, [songDuration]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !song) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      artwork: [
        { src: song.cover_art, sizes: "96x96", type: "image/png" },
        { src: song.cover_art, sizes: "192x192", type: "image/png" },
        { src: song.cover_art, sizes: "512x512", type: "image/png" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      audioPlayer.current.play();
      setIsPlaying(true);
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      audioPlayer.current.pause();
      setIsPlaying(false);
    });

    navigator.mediaSession.setActionHandler("previoustrack", backButton);
    navigator.mediaSession.setActionHandler("nexttrack", forwardButton);
  }, [song]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    if (!isPlaying) {
      audioPlayer.current.play();
    } else {
      audioPlayer.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar?.current?.value;
    setCurrentTime(progressBar.current.value);
  };

  const resetProgressBar = () => {
    setCurrentTime(0);
    if (progressBar.current) progressBar.current.value = 0;
  };

  const backButton = () => {
    const songIds = Object.keys(songsList);
    const currentIndex = songIds.indexOf(songId);
    const prevIndex = (currentIndex - 1 + songIds.length) % songIds.length;

    setCount((prev) => prev + 1);
    navigate(`/user/song/${songIds[prevIndex]}`, { replace: true });
    resetProgressBar();
  };

  const forwardButton = () => {
    const songIds = Object.keys(songsList);
    const currentIndex = songIds.indexOf(songId);
    const nextIndex = (currentIndex + 1) % songIds.length;

    setCount((prev) => prev + 1);
    navigate(`/user/song/${songIds[nextIndex]}`, { replace: true });
    resetProgressBar();
  };

  if (userLoading || recentlyPlayedLoading || !songsList || !song) {
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
