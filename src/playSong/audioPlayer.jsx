import React, { useState, useRef, useEffect } from "react";
import styles from "./audioPlayer.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { PlayArrow, Pause, SkipNext, SkipPrevious } from "@mui/icons-material";

import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

const AudioPlayer = () => {
  const id = useParams();
  const songId = id.id;
  const songsList = JSON.parse(localStorage.getItem("songsList"));
  const song = songsList[songId];
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const duration = song?.duration;
  const [currentTime, setCurrentTime] = useState(0);
  const navigate = useNavigate();

  // references
  const audioPlayer = useRef(); // reference our audio component
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

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
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  const backButton = () => {
    if (progressBar.current.value <= 2) {
      setIsPlaying(false);
      if (songId > 1) {
        navigate(`/songs/${songId - 1}`);
      } else {
        const keys = Object.keys(songsList);
        const lastKey = keys[keys.length - 1];
        navigate(`/songs/${lastKey}`);
      }
    }
    progressBar.current.value = 0;
    changeRange();
  };

  const forwardButton = () => {
    setIsPlaying(false);
    const keys = Object.keys(songsList);
    const lastKey = keys[keys.length - 1];
    if (songId === lastKey) {
      navigate(`/songs/1`);
    } else {
      navigate(`/songs/${Number(songId) + 1}`);
    }
    progressBar.current.value = duration;
    changeRange();
  };

  return (
    <Grid2 className={styles.audioPlayer}>
      <img
        src={song?.cover_art}
        alt={song?.title}
        className={styles.song_image}
      />
      <Grid2 className={styles.song_details}>
        <Grid2 className={styles.song_title}>
          <Typography variant="audioPlayerSongTitle">{song.title}</Typography>
        </Grid2>
        <Grid2 className={styles.song_artist}>
          <Typography variant="audioPlayerSongArtist">{song.artist}</Typography>
        </Grid2>
      </Grid2>
      <Grid2 className={styles.audio_buttons}>
        <audio
          ref={audioPlayer}
          src={song?.audio_url}
          preload="metadata"
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
      {/* current time */}
      <Grid2 className={styles.progress_bar_and_time}>
        <Grid2 className={styles.currentTime}>
          <Typography variant="AudioPlayerCurrentTimeAndDuration">
            {calculateTime(currentTime)}
          </Typography>
        </Grid2>

        {/* progress bar */}
        <Grid2>
          <input
            type="range"
            className={styles.progressBar}
            defaultValue="0"
            ref={progressBar}
            onChange={changeRange}
          />
        </Grid2>

        {/* duration */}
        <Grid2 className={styles.duration}>
          {duration && !isNaN(duration) ? (
            <Typography variant="AudioPlayerCurrentTimeAndDuration">
              {calculateTime(duration)}
            </Typography>
          ) : null}
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default AudioPlayer;
