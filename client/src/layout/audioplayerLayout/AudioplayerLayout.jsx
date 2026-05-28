import { Outlet } from "react-router-dom";
import Audioplayer from "../../components/audioplayer/Audioplayer";
import styles from "./audioplayerLayout.module.css";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import { currentSongSelector } from "../../redux/selectors/audioplayer.selector";

const AudioplayerLayout = () => {
  const currentSong = useSelector(currentSongSelector);

  return (
    <Grid className={styles.layout}>
      <Grid
        className={`${styles.outlet} ${!currentSong ? styles.outlet_full : ""}`}
      >
        <Outlet />
      </Grid>
      {currentSong ? (
        <Grid className={styles.audioplayer}>
          <Audioplayer />
        </Grid>
      ) : null}
    </Grid>
  );
};

export default AudioplayerLayout;
