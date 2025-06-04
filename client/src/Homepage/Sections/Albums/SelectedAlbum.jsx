import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import styles from "./selectedAlbum.module.css";
import useAudiusAlbumSong from "../../../hooks/useAudiusAlbumSongs";
import ErrorPage from "../../ErrorPage";
import { Backdrop, CircularProgress } from "@mui/material";
import AlbumSongList from "./AlbumSongList";

const SelectedAlbum = () => {
  const { slug } = useParams();
  const slugArray = decodeURIComponent(slug).split("-");
  const playlistId = slugArray.pop();

  const playlistTitle = slugArray.join("-");
  const { audiusAlbumSongLoading, audiusAlbumSongError } =
    useAudiusAlbumSong(playlistId);

  if (audiusAlbumSongLoading)
    return (
      <Backdrop
        className={styles.loader_backdrop}
        open={audiusAlbumSongLoading}
      >
        <CircularProgress className={styles.loader_spinner} />
      </Backdrop>
    );
  if (audiusAlbumSongError) return <ErrorPage />;

  return (
    <Grid2 className={styles.playlist_songs}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Songs in {playlistTitle}
        </Typography>
      </Grid2>
      <AlbumSongList playlistId={playlistId} />
    </Grid2>
  );
};

export default SelectedAlbum;
