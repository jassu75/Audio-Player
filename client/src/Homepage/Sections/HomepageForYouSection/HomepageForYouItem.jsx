import Grid2 from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import styles from "./homepageForYouItem.module.css";
import Typography from "@mui/material/Typography";

const HomepageForYouItem = ({ forYouKey, forYouItem }) => {
  const navigate = useNavigate();

  const handlePlaylistClick = () => {
    navigate(`/foryou/${forYouItem.foryou_title}/?page=1`);
  };

  return (
    <div className={styles.playlist_card_container}>
      <div className={styles.playlist_card} onClick={handlePlaylistClick}>
        <img
          loading="lazy"
          className={styles.playlist_image}
          src={forYouItem?.foryou_cover_art}
          alt=""
        />
        <Grid2 className={styles.playlist_content}>
          <Grid2>
            <Typography
              variant="homepageSongTitle"
              className={styles.playlist_title}
            >
              {forYouItem?.foryou_title}
            </Typography>
          </Grid2>
        </Grid2>
      </div>
    </div>
  );
};

export default HomepageForYouItem;
