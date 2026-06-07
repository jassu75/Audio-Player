import Grid2 from "@mui/material/Grid2";
import styles from "./playlistSongsList.module.css";
import { useSelector } from "react-redux";
import { viewingSonglistSelector } from "../../../redux/selectors/audioplayer.selector";
import PlaylistSong from "./playlistSong/PlaylistSong";

const PlaylistSongsList = ({ playlistId, page }) => {
  const viewingSonglist = useSelector(viewingSonglistSelector);
  const start = (page - 1) * 20;
  const end = start + 20;

  return (
    <Grid2 className={styles.song_list}>
      {Object.values(viewingSonglist)
        .slice(start, end)
        .map((song) => (
          <PlaylistSong
            key={song.song_id}
            playlistId={playlistId}
            song={song}
          />
        ))}
    </Grid2>
  );
};

export default PlaylistSongsList;
