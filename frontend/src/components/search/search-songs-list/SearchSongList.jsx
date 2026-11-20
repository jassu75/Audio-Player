import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import styles from "./searchSongList.module.css";
import { useDispatch, useSelector } from "react-redux";
import { viewingSongListSelector } from "../../../redux/selectors/audioPlayerSelectors.js";
import { useEffect } from "react";
import { indexSongs } from "../../../utils/songs";
import { setViewingSongList } from "../../../redux/slices/audioPlayerSlice.js";
import { recentlyPlayedSelector } from "../../../redux/selectors/userPreferencesSelectors.js";
import SearchSong from "./search-song/SearchSong";

const SearchSongList = ({ showRecentlyPlayed }) => {
  const songsList = useSelector(viewingSongListSelector);
  const recentlyPlayed = useSelector(recentlyPlayedSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (showRecentlyPlayed && recentlyPlayed) {
      dispatch(setViewingSongList(indexSongs(recentlyPlayed)));
    }
  }, [dispatch, recentlyPlayed, showRecentlyPlayed]);

  return (
    <Grid2 className={styles.song_list_container}>
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
