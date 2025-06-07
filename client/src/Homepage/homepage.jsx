import useHomepageSongs from "../hooks/useHomepageSongs";
import Grid2 from "@mui/material/Grid2";
import styles from "./homepage.module.css";
import UserWelcome from "./Sections/UserWelcome/UserWelcome";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import ErrorPage from "../HelperPages/ErrorPages/ErrorPage";
import useHomepagePlaylists from "../hooks/useHomepagePlaylists";
import HomepagePlaylistSection from "./Sections/Playlists/HomepagePlaylistSection";
import HomepageSongSection from "./Sections/Songs/HomepageSongSection/HomepageSongSection";
import useJamendoSongs from "../hooks/useJamendoSongs";
import useAudiusAlbums from "../hooks/useAudiusAlbums";
import HomepageAlbumSection from "./Sections/Albums/HomepageAlbumSection";

const Homepage = () => {
  const { homepageSongsLoading, homepageSongsError } = useHomepageSongs();
  const { homepagePlaylistsLoading, homepagePlaylistsError } =
    useHomepagePlaylists();
  const { jamendoSongsLoading, jamendoSongsError } = useJamendoSongs();
  const { audiusAlbumsLoading, audiusAlbumsError } = useAudiusAlbums();

  const loading =
    homepageSongsLoading ||
    homepagePlaylistsLoading ||
    jamendoSongsLoading ||
    audiusAlbumsLoading;
  const error =
    homepageSongsError ||
    homepagePlaylistsError ||
    jamendoSongsError ||
    audiusAlbumsError;

  if (loading)
    return (
      <Backdrop className={styles.loader_backdrop} open={loading}>
        <CircularProgress className={styles.loader_spinner} />
      </Backdrop>
    );
  if (error) return <ErrorPage />;

  return (
    <Grid2 className={styles.container}>
      <UserWelcome />

      <HomepagePlaylistSection />
      <HomepageAlbumSection />

      <HomepageSongSection />
    </Grid2>
  );
};

export default Homepage;
