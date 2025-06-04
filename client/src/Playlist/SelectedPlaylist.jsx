import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EmptySongsPage from "../Homepage/EmptyPages/EmptySongs";
import styles from "./selectedPlaylist.module.css";
import PlaylistUploadButton from "../CustomButtons/PlaylistUploadButton";
import PlaylistSongsList from "../Songlist/PlaylistSongsList/PlaylistSongsList";

const SelectedPlaylist = () => {
  const { playlistId } = useParams();
  const allPlaylist = useSelector((state) => state.homepage.playlists);
  const playlistSongs = allPlaylist[playlistId].playlist_songs;
  const playlistTitle = allPlaylist[playlistId].playlist_title;

  return (
    <Grid2 className={styles.playlist_songs}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Songs in {playlistTitle}
        </Typography>
        <PlaylistUploadButton playlistId={playlistId} />
      </Grid2>
      {!playlistSongs || Object.keys(playlistSongs).length !== 0 ? (
        <PlaylistSongsList playlistId={playlistId} songsList={playlistSongs} />
      ) : (
        <EmptySongsPage />
      )}
    </Grid2>
  );
};

export default SelectedPlaylist;
