import Grid2 from "@mui/material/Grid2";
import emptyImage from "../../assets/Homepage/EmptyMusic.png";
import styles from "./emptyHomepage.module.css";
import { Typography } from "@mui/material";

const EmptyHomePage = () => {
  return (
    <Grid2 className={styles.container}>
      <img className={styles.image} src={emptyImage} alt="" />
      <Typography
        variant="audioPlayerSongTitle"
        className={styles.redirect_text_heading}
      >
        Nothing Here Yet...
      </Typography>
    </Grid2>
  );
};

export default EmptyHomePage;
