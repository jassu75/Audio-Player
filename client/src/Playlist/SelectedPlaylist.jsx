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
import {
  playlistsSelector,
  songsSelector,
} from "../redux/selectors/homepage.selector";
import { Pagination } from "@mui/material";
import { useState } from "react";
import useFetchSongs from "../hooks/useFetchSongs";

const SelectedPlaylist = () => {
  const { playlistId } = useParams();
  const { userLoading, userError } = useFetchUserDetails();
  const allPlaylist = useSelector(playlistsSelector);
  const playlistSongs = useSelector(songsSelector);
  const playlistTitle = allPlaylist?.[playlistId]?.playlist_title;
  const [page, setPage] = useState(1);
  const { songsLoading, songsError } = useFetchSongs(playlistId);

  const handleSetPage = (_event, value) => {
    setPage(value);
  };

  if (userLoading || songsLoading) {
    return <PlaylistSkeleton />;
  }

  if (userError || songsError) {
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

      {playlistSongs && Object.keys(playlistSongs).length > 0 ? (
        <Grid2>
          <PlaylistSongsList
            playlistId={playlistId}
            playlistSongs={playlistSongs}
            page={page}
          />
          <Pagination
            variant="outlined"
            count={Math.ceil(Object.keys(playlistSongs).length / 10)}
            page={page}
            onChange={handleSetPage}
          />
        </Grid2>
      ) : (
        <EmptySongsPage />
      )}
    </Grid2>
  );
};

export default SelectedPlaylist;
