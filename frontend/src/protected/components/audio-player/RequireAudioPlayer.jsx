import { Outlet } from "react-router-dom";
import AudioPlayer from "../../../components/audio-player/AudioPlayer";
import styles from "./requireAudioPlayer.module.css";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import { currentSongSelector } from "../../../redux/selectors/audioPlayerSelectors.js";

const RequireAudioPlayer = () => {
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
          <AudioPlayer />
        </Grid>
      ) : null}
    </Grid>
  );
};

export default RequireAudioPlayer;
