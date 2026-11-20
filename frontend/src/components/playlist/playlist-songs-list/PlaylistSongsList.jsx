import Grid2 from "@mui/material/Grid2";
import styles from "./playlistSongsList.module.css";
import { useSelector } from "react-redux";
import { viewingSongListSelector } from "../../../redux/selectors/audioPlayerSelectors.js";
import PlaylistSong from "./playlist-song/PlaylistSong";

const PlaylistSongsList = ({ playlistId, page, type }) => {
  const viewingSongList = useSelector(viewingSongListSelector);
  const start = (page - 1) * 20;
  const end = start + 20;

  return (
    <Grid2 className={styles.song_list}>
      {Object.values(viewingSongList)
        .slice(start, end)
        .map((song) => (
          <PlaylistSong
            key={song.song_id}
            playlistId={playlistId}
            song={song}
            type={type}
          />
        ))}
    </Grid2>
  );
};

export default PlaylistSongsList;
