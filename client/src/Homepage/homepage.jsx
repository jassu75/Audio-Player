import useHomepageSongs from "../hooks/useHomepageSongs";
import Grid2 from "@mui/material/Grid2";
import styles from "./homepage.module.css";
import UserWelcome from "./Sections/UserWelcome/UserWelcome";
import ErrorPage from "../HelperPages/ErrorPages/ErrorPage";
import useHomepagePlaylists from "../hooks/useHomepagePlaylists";
import HomepagePlaylistSection from "./Sections/Playlists/HomepagePlaylistSection";
import HomepageSongSection from "./Sections/Songs/HomepageSongSection/HomepageSongSection";
import useJamendoSongs from "../hooks/useJamendoSongs";
import useAudiusAlbums from "../hooks/useAudiusAlbums";
import HomepageAlbumSection from "./Sections/Albums/HomepageAlbumSection";
import HomepageSkeleton from "./HomepageSkeleton";

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
    homepageSongsError || homepagePlaylistsError || jamendoSongsError;

  if (loading) return <HomepageSkeleton />;
  if (error) return <ErrorPage />;

  return (
    <Grid2 className={styles.container}>
      <UserWelcome />

      <HomepagePlaylistSection />
      {!audiusAlbumsError ? <HomepageAlbumSection /> : null}

      <HomepageSongSection />
    </Grid2>
  );
};

export default Homepage;
