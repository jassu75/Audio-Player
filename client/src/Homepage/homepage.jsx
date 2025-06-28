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
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSongs } from "../redux/slices/homepage.slice";

const Homepage = () => {
  const { jamendoSongsLoading, jamendoSongsError } = useJamendoSongs();
  const { audiusAlbumsLoading, audiusAlbumsError } = useAudiusAlbums();
  const { userLoading, userError } = useFetchUserDetails();
  const dispatch = useDispatch();

  const loading = userLoading || jamendoSongsLoading || audiusAlbumsLoading;
  const error = userError || jamendoSongsError || audiusAlbumsError;

  useEffect(() => {
    dispatch(setSongs(null));
  }, [dispatch]);

  if (error) return <ErrorPage />;

  return loading ? (
    <HomepageSkeleton />
  ) : (
    <Grid2 className={styles.container}>
      <UserWelcome />

      <HomepagePlaylistSection />
      <HomepageAlbumSection />

      <HomepageSongSection />
    </Grid2>
  );
};

export default Homepage;
