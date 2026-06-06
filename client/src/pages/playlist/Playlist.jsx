import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import styles from "./playlist.module.css";
import { viewingSonglistSelector } from "../../redux/selectors/audioplayer.selector";
import { Pagination } from "@mui/material";
import Error from "../helpers/error/Error";
import EmptySongslist from "../../components/helpers/emptyState/emptyPlaylist/EmptySongslist";
import PlaylistUploadButton from "../../components/playlist/helpers/playlistUploadButton/PlaylistUploadButton";
import PlaylistSkeleton from "../../components/skeletons/playlist/PlaylistSkeleton";
import PlaylistSongsList from "../../components/playlist/playlistSongslist/PlaylistSongsList";
import useFetchPlaylist from "./hooks/useFetchPlaylist";
import usePlaylistMetadata from "./hooks/usePlaylistMetadata";

const Playlist = () => {
  const { playlistId } = useParams();
  const { collectionId, type, playlistTitle } = usePlaylistMetadata(playlistId);
  const { loading, error } = useFetchPlaylist(collectionId, playlistId);
  const songsList = useSelector(viewingSonglistSelector);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  const handleSetPage = (_event, value) => {
    setSearchParams({ page: value }, { replace: true });
  };

  if (!songsList || loading) {
    return <PlaylistSkeleton />;
  }

  if (error) {
    return <Error />;
  }

  if (songsList && Object.keys(songsList).length === 0)
    return <EmptySongslist />;

  return (
    <Grid2 className={styles.playlist_songs}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Audio in {playlistTitle}
        </Typography>
        <PlaylistUploadButton type={type} playlistId={playlistId} />
      </Grid2>
      <Grid2 className={styles.songs_container}>
        <PlaylistSongsList playlistId={playlistId} page={page} />
        <Pagination
          variant="outlined"
          count={Math.ceil(Object.keys(songsList).length / 20)}
          page={Number(page)}
          onChange={handleSetPage}
        />
      </Grid2>
    </Grid2>
  );
};

export default Playlist;
