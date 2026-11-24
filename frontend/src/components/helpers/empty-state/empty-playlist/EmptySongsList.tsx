import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import styles from "./emptySongsList.module.css";
const EmptySongsList = () => {
  return (
    <Grid className={styles.redirect_text_container}>
      <Typography
        variant="audioPlayerSongTitle"
        className={styles.redirect_text_heading}
      >
        Nothing Here Yet...
      </Typography>
      <Typography variant="RedirectText" className={styles.redirect_text}>
        Add your favorite songs and enjoy listening ad-free.
      </Typography>
    </Grid>
  );
};
export default EmptySongsList;
