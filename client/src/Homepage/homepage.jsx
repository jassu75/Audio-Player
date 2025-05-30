import useHomepageSongs from "../hooks/useHomepageSongs";
import Grid2 from "@mui/material/Grid2";
import styles from "./homepage.module.css";
import UserWelcome from "./Sections/UserWelcome/UserWelcome";
import { Backdrop, CircularProgress } from "@mui/material";
import ErrorPage from "./ErrorPage";
import useHomepagePlaylists from "../hooks/useHomepagePlaylists";
import HomepagePlaylistSection from "./Sections/Playlists/HomepagePlaylistSection";
import HomepageSongSection from "./Sections/Songs/HomepageSongSection/HomepageSongSection";
import useJamendoSongs from "../hooks/useJamendoSongs";

const Homepage = () => {
  const { homepageSongsLoading, homepageSongsError } = useHomepageSongs();
  const { homepagePlaylistsLoading, homepagePlaylistsError } =
    useHomepagePlaylists();
  const { jamendoSongsLoading, jamendoSongsError } = useJamendoSongs();

  const loading =
    homepageSongsLoading || homepagePlaylistsLoading || jamendoSongsLoading;
  const error =
    homepageSongsError || homepagePlaylistsError || jamendoSongsError;

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

      <HomepageSongSection />
    </Grid2>
  );
};

export default Homepage;
