import { Grid, Typography } from "@mui/material";
import { useAppDispatch } from "../../../../redux/hooks";
import { startSearchPlayback } from "../../../../redux/slices/audioPlayerSlice";
import type { SearchSongProps } from "./types/SearchSong.types";
import styles from "./searchSong.module.css";
import SongCover from "../../../helpers/song-cover/SongCover";
import FavoriteIcon from "../../../favorites/favorite-icon/FavoriteIcon";
const SearchSong = ({ song }: SearchSongProps) => {
  const dispatch = useAppDispatch();
  const handleSongClick = () => {
    dispatch(startSearchPlayback({ song, sessionId: crypto.randomUUID() }));
  };
  return (
    <Grid className={styles.song_card_info} onClick={handleSongClick}>
      <SongCover
        loading="lazy"
        className={styles.song_image}
        src={song?.cover_art}
        alt=""
      />
      <Grid className={styles.song_content}>
        <Grid className={styles.song_title}>
          <Typography variant="homepageSongTitle" className={styles.song_title}>
            {song?.title}
          </Typography>
        </Grid>
        <Grid className={styles.song_artist}>
          <Typography
            variant="homepageSongArtist"
            className={styles.song_artist}
          >
            {song?.artist}
          </Typography>
        </Grid>
      </Grid>
      <FavoriteIcon songId={song.song_id} />
    </Grid>
  );
};
export default SearchSong;
