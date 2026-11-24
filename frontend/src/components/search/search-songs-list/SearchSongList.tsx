import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { viewingSongListSelector } from "../../../redux/selectors/audioPlayerSelectors";
import { recentlyPlayedSelector } from "../../../redux/selectors/userPreferencesSelectors";
import { setViewingSongList } from "../../../redux/slices/audioPlayerSlice";
import type { SearchSongListProps } from "./types/SearchSongList.types";
import { indexSongs } from "../../../utils/songs";
import SearchSong from "./search-song/SearchSong";
import styles from "./searchSongList.module.css";
const SearchSongList = ({ showRecentlyPlayed }: SearchSongListProps) => {
  const songsList = useAppSelector(viewingSongListSelector);
  const recentlyPlayed = useAppSelector(recentlyPlayedSelector);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (showRecentlyPlayed && recentlyPlayed) {
      dispatch(setViewingSongList(indexSongs(recentlyPlayed)));
    }
  }, [dispatch, recentlyPlayed, showRecentlyPlayed]);
  return (
    <Grid className={styles.song_list_container}>
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
    </Grid>
  );
};
export default SearchSongList;
