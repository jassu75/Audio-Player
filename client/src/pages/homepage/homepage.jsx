import Grid2 from "@mui/material/Grid2";
import styles from "./homepage.module.css";
import UserWelcome from "../../components/navbar/Navbar";
import HomepagePlaylistSection from "../../components/homepage/playlistSection/HomepagePlaylistSection";
import useFetchAudiusAlbums from "./hooks/useFetchAudiusAlbums";
import HomepageSkeleton from "../../Skeletons/HomepageSkeleton";
import useFetchUserDetails from "../../hooks/useFetchUserDetails";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setViewingSonglist } from "../../redux/slices/audioplayer.slice";
import useFetchRecentlyPlayed from "../../hooks/UserPrefs/useFetchRecentlyPlayed";
import {
  audiusPlaylistsSelector,
  userPlaylistsSelector,
  userSelector,
} from "../../redux/selectors/homepage.selector";
import Error from "../helpers/error/Error";
import HomepageForYouSection from "../../components/homepage/foryouSection/HomepageForYouSection";
import HomepageAlbumSection from "../../components/homepage/albumSection/HomepageAlbumSection";

const Homepage = () => {
  const { audiusAlbumsLoading, audiusAlbumsError } = useFetchAudiusAlbums();
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

  if (error) return <Error />;

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
