import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useAppDispatch } from "../../../../redux/hooks";
import type { PlaylistSongProps } from "./types/PlaylistSong.types";
import styles from "./playlistSong.module.css";
import { playSong, } from "../../../../redux/slices/audioPlayerSlice";
import PlaylistSongMenu from "./playlist-song-menu/PlaylistSongMenu";
import SongCover from "../../../helpers/song-cover/SongCover";
import FavoriteIcon from "../../../favorites/favorite-icon/FavoriteIcon";
const PlaylistSong = ({ playlistId, song, type }: PlaylistSongProps) => {
    const dispatch = useAppDispatch();
    const showMenu = type === "user";
    const handleSongClick = () => {
        dispatch(playSong(song.song_id));
    };
    return (<Grid className={styles.song_card}>
      <Grid className={styles.song_card_info} onClick={handleSongClick}>
        <SongCover loading="lazy" className={styles.song_image} src={song?.cover_art} alt=""/>
        <Grid className={styles.song_content}>
          <Grid className={styles.song_title}>
            <Typography variant="homepageSongTitle" className={styles.song_title}>
              {song?.title}
            </Typography>
          </Grid>
          <Grid className={styles.song_artist}>
            <Typography variant="homepageSongArtist" className={styles.song_artist}>
              {song?.artist}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid className={styles.song_actions}>
        <FavoriteIcon songId={song.song_id}/>
        {showMenu ? (<PlaylistSongMenu song={song} playlistId={playlistId}/>) : null}
      </Grid>
    </Grid>);
};
export default PlaylistSong;
