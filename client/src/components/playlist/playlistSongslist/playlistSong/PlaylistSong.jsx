import Typography from "@mui/material/Typography";
import styles from "./playlistSong.module.css";
import Grid2 from "@mui/material/Grid2";

import { useDispatch } from "react-redux";

import {
  setPlayingIndex,
  setPlayingSonglist,
} from "../../../../redux/slices/audioplayer.slice";
import PlaylistSongMenu from "./playlistSongMenu/PlaylistSongMenu";

const PlaylistSong = ({ playlistId, song, type }) => {
  const dispatch = useDispatch();
  const showMenu = type === "user";

  const handleSongClick = () => {
    dispatch(setPlayingSonglist());
    dispatch(setPlayingIndex(song.song_id));
  };

  return (
    <Grid2 className={styles.song_card}>
      <Grid2 className={styles.song_card_info} onClick={handleSongClick}>
        <img
          loading="lazy"
          className={styles.song_image}
          src={song?.cover_art}
          alt=""
        />
        <Grid2 className={styles.song_content}>
          <Grid2 className={styles.song_title}>
            <Typography
              variant="homepageSongTitle"
              className={styles.song_title}
            >
              {song?.title}
            </Typography>
          </Grid2>
          <Grid2 className={styles.song_artist}>
            <Typography
              variant="homepageSongArtist"
              className={styles.song_artist}
            >
              {song?.artist}
            </Typography>
          </Grid2>
        </Grid2>
      </Grid2>

      {showMenu ? (
        <PlaylistSongMenu song={song} playlistId={playlistId} />
      ) : null}
    </Grid2>
  );
};

export default PlaylistSong;
