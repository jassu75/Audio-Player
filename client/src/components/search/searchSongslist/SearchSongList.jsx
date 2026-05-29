import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import styles from "./searchSongList.module.css";
import { useDispatch, useSelector } from "react-redux";
import { viewingSonglistSelector } from "../../../redux/selectors/audioplayer.selector";
import { useEffect } from "react";
import { setViewingSonglist } from "../../../redux/slices/audioplayer.slice";
import { recentlyPlayedSelector } from "../../../redux/selectors/userPreferences.selector";
import SearchSong from "./searchSong/SearchSong";

const SearchSongList = ({ showRecentlyPlayed }) => {
  const songsList = useSelector(viewingSonglistSelector);
  const recentlyPlayed = useSelector(recentlyPlayedSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (showRecentlyPlayed && recentlyPlayed) {
      dispatch(setViewingSonglist(recentlyPlayed));
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
      {songsList && Object.keys(songsList).length > 0
        ? Object.values(songsList)
            .slice(0, 15)
            .map((song) => (
              <SearchSong
                key={song.song_id}
                songKey={song.song_id}
                song={song}
              />
            ))
        : null}
    </Grid2>
  );
};

export default SearchSongList;
