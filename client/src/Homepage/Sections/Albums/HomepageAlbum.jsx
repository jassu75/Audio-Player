import Grid2 from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import styles from "./homepageAlbum.module.css";
import Typography from "@mui/material/Typography";

const HomepageAlbum = ({ albumKey, album }) => {
  const navigate = useNavigate();

  const handleAlbumClick = () => {
    navigate(`/album/${encodeURIComponent(album.title)}-${albumKey}?page=1`);
  };

  return (
    <div className={styles.album_card_container}>
      <div className={styles.album_card} onClick={handleAlbumClick}>
        <img
          loading="lazy"
          className={styles.album_image}
          src={album.cover_art}
          alt=""
        />
        <Grid2 className={styles.album_content}>
          <Grid2>
            <Typography
              variant="homepageSongTitle"
              className={styles.album_title}
            >
              {album.title}
            </Typography>
          </Grid2>
        </Grid2>
      </div>
    </div>
  );
};

export default HomepageAlbum;
