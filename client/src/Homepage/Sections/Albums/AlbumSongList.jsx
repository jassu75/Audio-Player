import Grid2 from "@mui/material/Grid2";
import styles from "./albumSongList.module.css";
import AlbumSong from "./AlbumSong";
import { useSelector } from "react-redux";

const AlbumSongList = ({ playlistId }) => {
  const songsList = useSelector((state) => state.homepage.audiusSongs);
  return (
    <Grid2 className={styles.song_list}>
      {songsList
        ? songsList.map((song) => (
            <AlbumSong playlistId={playlistId} key={song.id} song={song} />
          ))
        : null}
    </Grid2>
  );
};

export default AlbumSongList;
