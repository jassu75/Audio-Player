import Grid2 from "@mui/material/Grid2";
import styles from "./albumSongList.module.css";
import AlbumSong from "./AlbumSong";
import { useSelector } from "react-redux";
import EmptyHomePage from "../../../HelperPages/EmptyPages/EmptyHomepage";
import { viewingSonglistSelector } from "../../../redux/selectors/audioplayer.selector";

const AlbumSongList = ({ playlistId, page }) => {
  const songsList = useSelector(viewingSonglistSelector);
  const start = (page - 1) * 20;
  const end = start + 20;

  return (
    <Grid2 className={styles.song_list}>
      {songsList && Object.keys(songsList).length > 0 ? (
        Object.entries(songsList)
          .slice(start, end)
          .map(([id, song]) => <AlbumSong songKey={id} key={id} song={song} />)
      ) : (
        <EmptyHomePage />
      )}
    </Grid2>
  );
};

export default AlbumSongList;
