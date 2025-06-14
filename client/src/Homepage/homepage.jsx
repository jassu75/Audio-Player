import Grid2 from "@mui/material/Grid2";
import styles from "./homepage.module.css";
import UserWelcome from "./Sections/UserWelcome/UserWelcome";
import ErrorPage from "../HelperPages/ErrorPages/ErrorPage";
import HomepagePlaylistSection from "./Sections/Playlists/HomepagePlaylistSection";
import HomepageSongSection from "./Sections/Songs/HomepageSongSection/HomepageSongSection";
import useJamendoSongs from "../hooks/useJamendoSongs";
import useAudiusAlbums from "../hooks/useAudiusAlbums";
import HomepageAlbumSection from "./Sections/Albums/HomepageAlbumSection";
import HomepageSkeleton from "../Skeletons/HomepageSkeleton";
import useFetchUserDetails from "../hooks/useFetchUserDetails";

const Homepage = () => {
  const { jamendoSongsLoading, jamendoSongsError } = useJamendoSongs();
  const { audiusAlbumsLoading, audiusAlbumsError } = useAudiusAlbums();
  const { userLoading, userError } = useFetchUserDetails();

  const loading = userLoading || jamendoSongsLoading || audiusAlbumsLoading;
  const error = userError || jamendoSongsError;

  if (error) return <ErrorPage />;

  return loading ? (
    <HomepageSkeleton />
  ) : (
    <Grid2 className={styles.container}>
      <UserWelcome />

      <HomepagePlaylistSection />
      {!audiusAlbumsError ? <HomepageAlbumSection /> : null}

      <HomepageSongSection />
    </Grid2>
  );
};

export default Homepage;
