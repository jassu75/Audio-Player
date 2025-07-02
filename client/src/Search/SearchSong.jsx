import { Grid2, Typography } from "@mui/material";
import styles from "./searchSong.module.css";
import { useNavigate } from "react-router-dom";

const SearchSong = ({ songKey, song }) => {
  const navigate = useNavigate();
  const handleSongClick = () => {
    navigate(`/user/song/${songKey}`);
  };

  return (
    <Grid2 className={styles.song_card_info} onClick={handleSongClick}>
      <img className={styles.song_image} src={song?.cover_art} alt="" />
      <Grid2 className={styles.song_content}>
        <Grid2 className={styles.song_title}>
          <Typography variant="homepageSongTitle" className={styles.song_title}>
            {song?.title}
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
  );
};

export default SearchSong;
