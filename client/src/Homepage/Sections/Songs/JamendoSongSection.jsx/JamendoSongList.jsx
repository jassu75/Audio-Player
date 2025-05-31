import Grid2 from "@mui/material/Grid2";
import styles from "./jamendoSongList.module.css";
import JamendoSong from "./JamendoSong";
import { useSelector } from "react-redux";

const JamendoSongList = () => {
  const jamendoSongList = useSelector((state) => state.homepage.jamendoSongs);
  return (
    <Grid2 className={styles.container}>
      <Grid2 className={styles.song_list}>
        {jamendoSongList.map((song) => (
          <JamendoSong key={song.id} songKey={song.id} song={song} />
        ))}
      </Grid2>
    </Grid2>
  );
};

export default JamendoSongList;
