import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import usePagination from "../../hooks/usePagination";
import styles from "./playlist.module.css";
import { viewingSongListSelector } from "../../redux/selectors/audioPlayerSelectors.js";
import { Pagination } from "@mui/material";
import Error from "../helpers/error/Error";
import EmptySongsList from "../../components/helpers/empty-state/empty-playlist/EmptySongsList";
import PlaylistUploadButton from "../../components/playlist/helpers/playlist-upload-button/PlaylistUploadButton";
import PlaylistSkeleton from "../../components/skeletons/playlist/PlaylistSkeleton";
import PlaylistSongsList from "../../components/playlist/playlist-songs-list/PlaylistSongsList";
import useFetchPlaylist from "./hooks/useFetchPlaylist";
import usePlaylistMetadata from "./hooks/usePlaylistMetadata";

const Playlist = () => {
  const { playlistId } = useParams();
  const { type, playlistTitle } = usePlaylistMetadata(playlistId);
  const { loading, error } = useFetchPlaylist(playlistId);
  const viewingSongsList = useSelector(viewingSongListSelector);

  const { page, pageCount, handlePageChange } = usePagination(
    Object.keys(viewingSongsList ?? {}).length,
  );

  if (error) {
    return <Error />;
  }

  if (!viewingSongsList || loading) {
    return <PlaylistSkeleton />;
  }

  return (
    <Grid2 className={styles.playlist_songs}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Audio in {playlistTitle}
        </Typography>
        <PlaylistUploadButton type={type} playlistId={playlistId} />
      </Grid2>
      <Grid2 className={styles.songs_container}>
        {Object.keys(viewingSongsList).length === 0 ? (
          <EmptySongsList />
        ) : (
          <>
            <PlaylistSongsList playlistId={playlistId} page={page} type={type} />
            <Pagination
              variant="outlined"
              count={pageCount}
              page={page}
              onChange={handlePageChange}
            />
          </>
        )}
      </Grid2>
    </Grid2>
  );
};

export default Playlist;
