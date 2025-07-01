import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import SearchSong from "./SearchSong";
import styles from "./searchSongList.module.css";
import { useSelector } from "react-redux";
import { songsSelector } from "../redux/selectors/homepage.selector";

const SearchSongList = ({ showRecentlyPlayed }) => {
  const songsList = useSelector(songsSelector);
  return (
    <Grid2 className={styles.songlist_container}>
      {showRecentlyPlayed ? (
        <Typography
          variant="recentlyPlayedText"
          className={styles.recently_played_text}
        >
          RECENTLY PLAYED
        </Typography>
      ) : null}
      {Object.entries(songsList ?? {})
        .slice(0, 15)
        .map(([id, song]) => (
          <SearchSong key={id} songKey={id} song={song} />
        ))}
    </Grid2>
  );
};

export default SearchSongList;
