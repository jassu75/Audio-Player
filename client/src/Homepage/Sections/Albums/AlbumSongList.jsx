import Grid2 from "@mui/material/Grid2";
import styles from "./albumSongList.module.css";
import AlbumSong from "./AlbumSong";
import { useSelector } from "react-redux";
import { audiusSongsSelector } from "../../../redux/selectors/homepage.selector";

const AlbumSongList = ({ playlistId }) => {
  const songsList = useSelector(audiusSongsSelector);
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
