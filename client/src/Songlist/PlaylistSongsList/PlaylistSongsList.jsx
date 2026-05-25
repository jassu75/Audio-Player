import Grid2 from "@mui/material/Grid2";
import styles from "./playlistSongsList.module.css";
import { useSelector } from "react-redux";
import PlaylistSong from "./PlaylistSong";
import { viewingSonglistSelector } from "../../redux/selectors/audioplayer.selector";

const PlaylistSongsList = ({ playlistId, page }) => {
  const allSongs = useSelector(viewingSonglistSelector);
  const start = (page - 1) * 20;
  const end = start + 20;

  return (
    <Grid2 className={styles.song_list}>
      {allSongs
        ? Object.entries(allSongs)
            .slice(start, end)
            .map(([id, song]) => (
              <PlaylistSong
                key={id}
                playlistId={playlistId}
                songKey={id}
                song={song}
              />
            ))
        : null}
    </Grid2>
  );
};

export default PlaylistSongsList;
