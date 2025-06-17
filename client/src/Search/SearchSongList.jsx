import { Grid2 } from "@mui/material";
import SearchSong from "./SearchSong";
import styles from "./searchSongList.module.css";

const SearchSongList = ({ songsList }) => {
  return (
    <Grid2 className={styles.songlist_container}>
      {Object.entries(songsList).map(([id, song]) => (
        <SearchSong key={id} songKey={id} song={song} />
      ))}
    </Grid2>
  );
};

export default SearchSongList;
