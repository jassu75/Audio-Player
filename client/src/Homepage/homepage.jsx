import Grid2 from "@mui/material/Grid2";
import styles from "./homepage.module.css";
import UserWelcome from "./Sections/UserWelcome/UserWelcome";
import ErrorPage from "../HelperPages/ErrorPages/ErrorPage";
import HomepagePlaylistSection from "./Sections/Playlists/HomepagePlaylistSection";
import HomepageForYouSection from "./Sections/HomepageForYouSection/HomepageForYouSection";
import useAudiusAlbums from "../hooks/Audius/useAudiusAlbums";
import HomepageAlbumSection from "./Sections/Albums/HomepageAlbumSection";
import HomepageSkeleton from "../Skeletons/HomepageSkeleton";
import useFetchUserDetails from "../hooks/useFetchUserDetails";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSongs } from "../redux/slices/homepage.slice";
import useFetchRecentlyPlayed from "../hooks/UserPrefs/useFetchRecentlyPlayed";
import {
  audiusAlbumsSelector,
  playlistsSelector,
  userSelector,
} from "../redux/selectors/homepage.selector";

const Homepage = () => {
  const { audiusAlbumsLoading, audiusAlbumsError } = useAudiusAlbums();
  const { userLoading, userError } = useFetchUserDetails();
  const { recentlyPlayedLoading } = useFetchRecentlyPlayed();
  const dispatch = useDispatch();

  const user = useSelector(userSelector);
  const playlists = useSelector(playlistsSelector);
  const audiusAlbums = useSelector(audiusAlbumsSelector);

  const loading =
    userLoading ||
    audiusAlbumsLoading ||
    recentlyPlayedLoading ||
    !user ||
    !playlists ||
    !audiusAlbums;
  const error = userError || audiusAlbumsError;

  useEffect(() => {
    dispatch(setSongs(null));
  }, [dispatch]);

  if (error) return <ErrorPage />;

  return loading ? (
    <HomepageSkeleton />
  ) : (
    <Grid2 className={styles.container}>
      <UserWelcome />
      <HomepageForYouSection />

      <HomepagePlaylistSection />
      <HomepageAlbumSection />
    </Grid2>
  );
};

export default Homepage;
