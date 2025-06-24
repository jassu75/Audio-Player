import { Grid2, Typography } from "@mui/material";
import SearchSong from "./SearchSong";
import styles from "./recentlyPlayed.module.css";
import { useSelector } from "react-redux";
import { recentlyPlayedSongsSelector } from "../redux/selectors/userPrefs.selector";

const RecentlyPlayed = () => {
  const recentlyPlayedSongs = useSelector(recentlyPlayedSongsSelector);

  return (
    <Grid2 className={styles.songlist_container}>
      <Typography
        variant="recentlyPlayedText"
        className={styles.recently_played_text}
      >
        RECENTLY PLAYED
      </Typography>
      {Object.entries(recentlyPlayedSongs).map(([id, song]) => (
        <SearchSong key={id} songKey={id} song={song} />
      ))}
    </Grid2>
  );
};

export default RecentlyPlayed;
