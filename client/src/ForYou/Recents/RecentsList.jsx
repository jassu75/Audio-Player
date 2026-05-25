import Grid2 from "@mui/material/Grid2";
import styles from "./recentsList.module.css";
import { useDispatch, useSelector } from "react-redux";
import PlaylistSkeleton from "../../Skeletons/PlaylistSkeleton";
import ErrorPage from "../../HelperPages/ErrorPages/ErrorPage";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import useFetchRecentlyPlayed from "../../hooks/UserPrefs/useFetchRecentlyPlayed";
import useFetchUserDetails from "../../hooks/useFetchUserDetails";
import { recentlyPlayedSelector } from "../../redux/selectors/userPreferences.selector";
import RecentSong from "./RecentSong";
import { useSearchParams } from "react-router-dom";
import EmptyHomePage from "../../HelperPages/EmptyPages/EmptyHomepage";
import { viewingSonglistSelector } from "../../redux/selectors/audioplayer.selector";
import { useEffect } from "react";
import { setViewingSonglist } from "../../redux/slices/audioplayer.slice";

const RecentsList = () => {
  const { userLoading, userError } = useFetchUserDetails();
  const { recentlyPlayedLoading, recentlyPlayedError } =
    useFetchRecentlyPlayed();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const songsList = useSelector(viewingSonglistSelector);
  const recentlyPlayed = useSelector(recentlyPlayedSelector);
  const start = (page - 1) * 20;
  const end = start + 20;
  const dispatch = useDispatch();

  useEffect(() => {
    if (recentlyPlayed) {
      dispatch(setViewingSonglist(recentlyPlayed));
    }
  }, [dispatch, recentlyPlayed]);

  const handleSetPage = (_event, value) => {
    setSearchParams({ page: value }, { replace: true });
  };

  if (userLoading || recentlyPlayedLoading || !songsList)
    return <PlaylistSkeleton />;
  if (userError || recentlyPlayedError) return <ErrorPage />;

  return (
    <Grid2 className={styles.recent_songs}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Songs in Recents
        </Typography>
      </Grid2>
      <Grid2 className={styles.songs_container}>
        {songsList.length > 0 ? (
          <>
            <Grid2 className={styles.song_list}>
              {songsList?.slice(start, end).map((song) => (
                <RecentSong
                  key={song.song_id}
                  songKey={song.song_id}
                  song={song}
                />
              ))}
            </Grid2>
            <Pagination
              variant="outlined"
              count={Math.ceil(songsList.length / 20)}
              page={page}
              onChange={handleSetPage}
            />
          </>
        ) : (
          <EmptyHomePage />
        )}
      </Grid2>
    </Grid2>
  );
};

export default RecentsList;
