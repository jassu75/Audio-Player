import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import styles from "./playlist.module.css";
import useFetchUserDetails from "../../hooks/useFetchUserDetails";
import { viewingSonglistSelector } from "../../redux/selectors/audioplayer.selector";
import { Pagination } from "@mui/material";
import useFetchFavoriteIds from "../../hooks/Favorites/useFetchFavoriteIds";
import { PLAYLIST_HOOK_MAP } from "./consts/playlist.consts";
import ErrorPage from "../../HelperPages/ErrorPages/ErrorPage";
import EmptySongsPage from "../../HelperPages/EmptyPages/EmptySongs";
import PlaylistUploadButton from "../../CustomButtons/PlaylistUploadButton/PlaylistUploadButton";
import PlaylistSkeleton from "../../Skeletons/PlaylistSkeleton";
import useGetPlaylistTitle from "./hooks/useGetPlaylistTitle";
import PlaylistSongsList from "./helpers/playlistSongslist/PlaylistSongsList";

const Playlist = () => {
  const { collection, playlistId } = useParams();
  const playlistFetch = PLAYLIST_HOOK_MAP[collection](playlistId);
  const playlistTitle = useGetPlaylistTitle(collection, playlistId);
  const userFetch = useFetchUserDetails();
  const favoritesIdsFetch = useFetchFavoriteIds();
  const songsList = useSelector(viewingSonglistSelector);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  const handleSetPage = (_event, value) => {
    setSearchParams({ page: value }, { replace: true });
  };

  if (playlistFetch.loading || userFetch.loading || favoritesIdsFetch.loading) {
    return <PlaylistSkeleton />;
  }

  if (userFetch.error || playlistFetch.error || favoritesIdsFetch.error) {
    return <ErrorPage />;
  }

  if (songsList && Object.keys(songsList).length === 0)
    return <EmptySongsPage />;

  return (
    <Grid2 className={styles.playlist_songs}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          {playlistTitle}
        </Typography>
        <PlaylistUploadButton collection={collection} playlistId={playlistId} />
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
