import Typography from "@mui/material/Typography";
import styles from "./albumSong.module.css";
import Grid2 from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";

const AlbumSong = ({ song, playlistId }) => {
  const navigate = useNavigate();

  const handleSongClick = () => {
    navigate(`/album/${playlistId}/song/${song.id}`);
  };

  return (
    <Grid2 className={styles.song_card}>
      <Grid2 className={styles.song_card_info} onClick={handleSongClick}>
        <img
          loading="lazy"
          className={styles.song_image}
          src={song?.cover_art}
          alt=""
        />
        <Grid2 className={styles.song_content}>
          <Grid2 className={styles.song_title}>
            <Typography
              variant="homepageSongTitle"
              className={styles.song_title}
            >
              {song.title}
            </Typography>
          </Grid2>
          <Grid2 className={styles.song_artist}>
            <Typography
              variant="homepageSongArtist"
              className={styles.song_artist}
            >
              {song?.artist}
            </Typography>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default AlbumSong;
