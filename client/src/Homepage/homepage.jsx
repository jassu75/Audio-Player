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
import { setViewingSonglist } from "../redux/slices/audioplayer.slice";
import useFetchRecentlyPlayed from "../hooks/UserPrefs/useFetchRecentlyPlayed";
import {
  audiusPlaylistsSelector,
  userPlaylistsSelector,
  userSelector,
} from "../redux/selectors/homepage.selector";

const Homepage = () => {
  const { audiusAlbumsLoading, audiusAlbumsError } = useAudiusAlbums();
  const { userLoading, userError } = useFetchUserDetails();
  const { recentlyPlayedLoading } = useFetchRecentlyPlayed();
  const dispatch = useDispatch();

  const user = useSelector(userSelector);
  const playlists = useSelector(userPlaylistsSelector);
  const audiusAlbums = useSelector(audiusPlaylistsSelector);

  const loading =
    userLoading ||
    audiusAlbumsLoading ||
    recentlyPlayedLoading ||
    !user ||
    !playlists ||
    !audiusAlbums;
  const error = userError || audiusAlbumsError;

  useEffect(() => {
    dispatch(setViewingSonglist(null));
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
