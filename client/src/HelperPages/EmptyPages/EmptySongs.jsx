import Grid2 from "@mui/material/Grid2";
import styles from "./emptySongs.module.css";
import Typography from "@mui/material/Typography";

const EmptySongsPage = () => {
  return (
    <Grid2 className={styles.redirect_text_container}>
      <Typography
        variant="audioPlayerSongTitle"
        className={styles.redirect_text_heading}
      >
        Nothing Here Yet...
      </Typography>
      <Typography variant="RedirectText" className={styles.redirect_text}>
        Add your favorite songs and enjoy listening ad-free.
      </Typography>
    </Grid2>
  );
};

export default EmptySongsPage;
