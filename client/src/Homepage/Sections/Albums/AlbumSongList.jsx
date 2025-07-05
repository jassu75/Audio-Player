import Grid2 from "@mui/material/Grid2";
import styles from "./albumSongList.module.css";
import AlbumSong from "./AlbumSong";
import { useSelector } from "react-redux";
import { audiusSongsSelector } from "../../../redux/selectors/homepage.selector";
import EmptyHomePage from "../../../HelperPages/EmptyPages/EmptyHomepage";

const AlbumSongList = ({ playlistId, page }) => {
  const songsList = useSelector(audiusSongsSelector);
  const start = (page - 1) * 20;
  const end = start + 20;

  return (
    <Grid2 className={styles.song_list}>
      {songsList.length > 0 ? (
        songsList
          .slice(start, end)
          .map((song) => (
            <AlbumSong playlistId={playlistId} key={song.id} song={song} />
          ))
      ) : (
        <EmptyHomePage />
      )}
    </Grid2>
  );
};

export default AlbumSongList;
