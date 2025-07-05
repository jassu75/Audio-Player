import Grid2 from "@mui/material/Grid2";
import emptyImage from "../../assets/images/Homepage/EmptyMusic.png";
import styles from "./emptyAlbum.module.css";
import { Typography } from "@mui/material";

const EmptyAlbum = () => {
  return (
    <Grid2 className={styles.container}>
      <img loading="lazy" className={styles.image} src={emptyImage} alt="" />
      <Typography
        variant="audioPlayerSongTitle"
        className={styles.redirect_text_heading}
      >
        Dang! We couldn’t find any songs in this album
      </Typography>
      <Typography variant="RedirectText" className={styles.redirect_text}>
        Maybe the artist’s still cooking them up?
      </Typography>
    </Grid2>
  );
};

export default EmptyAlbum;
