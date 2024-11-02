import React from 'react';
import Typography from '@mui/material/Typography';
import styles from './homepageSong.module.css';
import Grid2 from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';

const HomepageSong = ({ song }) => {
      const navigate = useNavigate();

    const handleSongClick = () => {
        navigate(`/songs/${song.id}`);
    };
    return (
        <Grid2 className={styles.song_card} onClick={handleSongClick}>
            <Grid2 className={styles.song_image}>
                <img src={song.cover_art} alt={song.title} />
            </Grid2>
            <Grid2 className={styles.song_content}>
            <Grid2 className={styles.song_title}>
                <Typography variant="homepageSongTitle" className={styles.song_title}>
                    {song.title}
                </Typography>
            </Grid2>
            <Grid2 className={styles.song_artist}>
                <Typography variant="homepageSongArtist" className={styles.song_artist}>
                    {song.artist}
                </Typography>
                </Grid2>
                </Grid2>
        </Grid2>
    );
};

export default HomepageSong;
