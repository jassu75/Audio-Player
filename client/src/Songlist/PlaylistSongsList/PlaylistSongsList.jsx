import Grid2 from "@mui/material/Grid2";
import styles from "./playlistSongsList.module.css";
import { useSelector } from "react-redux";
import PlaylistSong from "./PlaylistSong";

const PlaylistSongsList = ({ playlistId, songsList }) => {
  const allSongs = useSelector((state) => state.homepage.songs);

  return (
    <Grid2 className={styles.song_list}>
      {songsList
        ? songsList.map((value) => (
            <PlaylistSong
              key={value}
              playlistId={playlistId}
              songKey={value}
              song={allSongs?.[value]}
            />
          ))
        : null}
    </Grid2>
  );
};

export default PlaylistSongsList;
