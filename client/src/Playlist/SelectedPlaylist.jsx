import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EmptySongsPage from "../HelperPages/EmptyPages/EmptySongs";
import styles from "./selectedPlaylist.module.css";
import PlaylistUploadButton from "../CustomButtons/PlaylistUploadButton/PlaylistUploadButton";
import PlaylistSongsList from "../Songlist/PlaylistSongsList/PlaylistSongsList";
import useFetchUserDetails from "../hooks/useFetchUserDetails";
import ErrorPage from "../HelperPages/ErrorPages/ErrorPage";
import PlaylistSkeleton from "../Skeletons/PlaylistSkeleton";
import { playlistsSelector } from "../redux/selectors/homepage.selector";

const SelectedPlaylist = () => {
  const { playlistId } = useParams();
  const { userLoading, userError } = useFetchUserDetails();
  const allPlaylist = useSelector(playlistsSelector);
  const playlistSongs = allPlaylist?.[playlistId]?.playlist_songs;
  const playlistTitle = allPlaylist?.[playlistId]?.playlist_title;

  if (userLoading) {
    return <PlaylistSkeleton />;
  }

  if (userError) {
    return <ErrorPage />;
  }

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
