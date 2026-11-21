import Grid from "@mui/material/Grid";
import { Outlet } from "react-router-dom";
import AudioPlayer from "../../../components/audio-player/AudioPlayer";
import { useAppSelector } from "../../../redux/hooks";
import { currentSongSelector } from "../../../redux/selectors/audioPlayerSelectors";
import styles from "./requireAudioPlayer.module.css";
const RequireAudioPlayer = () => {
  const currentSong = useAppSelector(currentSongSelector);
  return (
    <Grid className={styles.layout}>
      <Grid
        className={`${styles.outlet} ${!currentSong ? styles.outlet_full : ""}`}
      >
        <Outlet />
      </Grid>
      <Grid className={currentSong ? styles.audioplayer : styles.idle_player}>
          <AudioPlayer />
        </Grid>
    </Grid>
  );
};
export default RequireAudioPlayer;
