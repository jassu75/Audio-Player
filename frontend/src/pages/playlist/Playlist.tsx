import { Pagination } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import EmptySongsList from "../../components/helpers/empty-state/empty-playlist/EmptySongsList";
import PlaylistUploadButton from "../../components/playlist/helpers/playlist-upload-button/PlaylistUploadButton";
import PlaylistSongsList from "../../components/playlist/playlist-songs-list/PlaylistSongsList";
import PlaylistSkeleton from "../../components/skeletons/playlist/PlaylistSkeleton";
import usePagination from "../../hooks/usePagination";
import { useAppSelector } from "../../redux/hooks";
import { viewingSongListSelector } from "../../redux/selectors/audioPlayerSelectors";
import Error from "../helpers/error/Error";
import useFetchPlaylist from "./hooks/useFetchPlaylist";
import usePlaylistMetadata from "./hooks/usePlaylistMetadata";
import styles from "./playlist.module.css";
import BackButton from "../../components/helpers/back-button/BackButton";
const Playlist = () => {
  const { playlistId = "" } = useParams();
  const { type, playlistTitle } = usePlaylistMetadata(playlistId);
  const { loading, error } = useFetchPlaylist(playlistId);
  const viewingSongsList = useAppSelector(viewingSongListSelector);
  const { page, pageCount, handlePageChange } = usePagination(
    Object.keys(viewingSongsList ?? {}).length,
  );
  if (error) return <Error />;
  if (!viewingSongsList || loading) return <PlaylistSkeleton />;
  return (
    <>
      <BackButton />
      <Grid className={styles.playlist_songs}>
        <Grid className={styles.title}>
          <Typography variant="HomepageTitleText" className={styles.title_text}>
            Audio in {playlistTitle}
          </Typography>
          <PlaylistUploadButton type={type} playlistId={playlistId} />
        </Grid>
        <Grid className={styles.songs_container}>
          {Object.keys(viewingSongsList).length === 0 ? (
            <EmptySongsList />
          ) : (
            <>
              <PlaylistSongsList
                playlistId={playlistId}
                page={page}
                type={type}
              />
              <Pagination
                variant="outlined"
                count={pageCount}
                page={page}
                onChange={handlePageChange}
              />
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};
export default Playlist;
