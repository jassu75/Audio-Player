import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useParams, useSearchParams } from "react-router-dom";
import styles from "./selectedAlbum.module.css";
import useAudiusAlbumSong from "../../../hooks/Audius/useAudiusAlbumSongs";
import AlbumSongList from "./AlbumSongList";
import EmptyAlbum from "../../../HelperPages/EmptyPages/EmptyAlbum";
import PlaylistSkeleton from "../../../Skeletons/PlaylistSkeleton";
import { Pagination } from "@mui/material";
import { useSelector } from "react-redux";
import { audiusSongsSelector } from "../../../redux/selectors/homepage.selector";

const SelectedAlbum = () => {
  const { slug } = useParams();
  const slugArray = decodeURIComponent(slug).split("-");
  const playlistId = slugArray.pop();
  const songsList = useSelector(audiusSongsSelector);

  const playlistTitle = slugArray.join("-");
  const { audiusAlbumSongLoading, audiusAlbumSongError } =
    useAudiusAlbumSong(playlistId);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  const handleSetPage = (_event, value) => {
    setSearchParams({ page: value }, { replace: true });
  };

  if (audiusAlbumSongLoading || !songsList) return <PlaylistSkeleton />;
  if (audiusAlbumSongError) return <EmptyAlbum />;

  return (
    <Grid2 className={styles.playlist_songs}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Songs in {playlistTitle}
        </Typography>
      </Grid2>
      <Grid2 className={styles.songs_container}>
        <AlbumSongList playlistId={playlistId} page={page} />
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

export default SelectedAlbum;
