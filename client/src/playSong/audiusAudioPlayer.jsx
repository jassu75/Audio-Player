import React, { useState, useRef, useEffect } from "react";
import styles from "./audiusAudioPlayer.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { PlayArrow, Pause, SkipNext, SkipPrevious } from "@mui/icons-material";

import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import useAudiusAlbumSong from "../hooks/useAudiusAlbumSongs";
import { Backdrop, CircularProgress } from "@mui/material";
import ErrorPage from "../Homepage/ErrorPage";

const AudiusAudioPlayer = () => {
  const { playlistId, songId } = useParams();
  const { audiusAlbumSongLoading, audiusAlbumSongError } =
    useAudiusAlbumSong(playlistId);

  const [id, setId] = useState(songId);
  const songsList = useSelector((state) => state.homepage.audiusSongs);
  const song = songsList?.find((song) => song.id === id);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const navigate = useNavigate();

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
        const currentIndex = songsList.findIndex((song) => song.id === id);
        const nextIndex = (currentIndex + 1) % songsList.length;
        const nextSongId = songsList[nextIndex].id;
        setId(nextSongId);
        const nextSong = songsList[nextIndex];

        player.src = nextSong.audio_url;

        const playNextSong = () => {
          player.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
        };

        player.addEventListener("canplaythrough", playNextSong, { once: true });

        navigate(`/album/${playlistId}/song/${nextSongId}`, { replace: true });
        resetProgressBar();
      };

      player.addEventListener("ended", handleEnded);

      return () => {
        player.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioPlayer, navigate, id, songsList]);

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
    const currentIndex = songsList.findIndex((song) => song.id === id);
    const prevSongId =
      songsList[(currentIndex - 1 + songsList.length) % songsList.length].id;

    setId(prevSongId);
    setIsPlaying(false);
    navigate(`/album/${playlistId}/song/${prevSongId}`, { replace: true });
    resetProgressBar();
  };

  const forwardButton = () => {
    const currentIndex = songsList.findIndex((song) => song.id === id);
    const nextSongId = songsList[(currentIndex + 1) % songsList.length].id;

    setId(nextSongId);

    setIsPlaying(false);
    navigate(`/album/${playlistId}/song/${nextSongId}`, { replace: true });
    resetProgressBar();
  };

  if (audiusAlbumSongLoading)
    return (
      <Backdrop
        className={styles.loader_backdrop}
        open={audiusAlbumSongLoading}
      >
        <CircularProgress className={styles.loader_spinner} />
      </Backdrop>
    );
  if (audiusAlbumSongError) return <ErrorPage />;

  return (
    <Grid2 className={styles.audioPlayer}>
      <img src={song?.cover_art} alt="" className={styles.song_image} />
      <Grid2 className={styles.song_details}>
        <Grid2 className={styles.song_title}>
          <Typography variant="audioPlayerSongTitle">{song?.title}</Typography>
        </Grid2>
        <Grid2 className={styles.song_artist}>
          <Typography variant="audioPlayerSongArtist">
            {song?.artist}
          </Typography>
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

export default AudiusAudioPlayer;
