import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import SearchSong from "./SearchSong";
import styles from "./searchSongList.module.css";
import { useDispatch, useSelector } from "react-redux";
import { songsSelector } from "../redux/selectors/homepage.selector";
import { recentlyPlayedSongSelector } from "../redux/selectors/userPreferences.selector";
import { useEffect } from "react";
import { setSongs } from "../redux/slices/homepage.slice";

const SearchSongList = ({ showRecentlyPlayed }) => {
  const songsList = useSelector(songsSelector);
  const recentlyPlayed = useSelector(recentlyPlayedSongSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (showRecentlyPlayed && recentlyPlayed) {
      dispatch(setSongs(recentlyPlayed));
    }
  }, [dispatch, recentlyPlayed, showRecentlyPlayed]);
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
