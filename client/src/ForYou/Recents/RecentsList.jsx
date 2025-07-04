import Grid2 from "@mui/material/Grid2";
import styles from "./recentsList.module.css";
import { useSelector } from "react-redux";
import PlaylistSkeleton from "../../Skeletons/PlaylistSkeleton";
import ErrorPage from "../../HelperPages/ErrorPages/ErrorPage";
import { Typography } from "@mui/material";
import useFetchRecentlyPlayed from "../../hooks/RecentlyPlayed/useFetchRecentlyPlayed";
import useFetchUserDetails from "../../hooks/useFetchUserDetails";
import { recentlyPlayedSelector } from "../../redux/selectors/userPreferences.selector";
import RecentSong from "./RecentSong";

const RecentsList = () => {
  const { userLoading, userError } = useFetchUserDetails();
  const { recentlyPlayedLoading, recentlyPlayedError } =
    useFetchRecentlyPlayed();
  const recentlyPlayed = useSelector(recentlyPlayedSelector);

  if (userLoading || recentlyPlayedLoading) return <PlaylistSkeleton />;
  if (userError || recentlyPlayedError) return <ErrorPage />;

  return (
    <Grid2 className={styles.recent_songs}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Songs in Recents
        </Typography>
      </Grid2>
      <Grid2 className={styles.song_list}>
        {recentlyPlayed?.map((song) => (
          <RecentSong key={song.song_id} songKey={song.song_id} song={song} />
        ))}
      </Grid2>
    </Grid2>
  );
};

export default RecentsList;
