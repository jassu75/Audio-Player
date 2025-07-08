import Grid2 from "@mui/material/Grid2";
import styles from "./mostPlayedList.module.css";
import { useSelector } from "react-redux";
import PlaylistSkeleton from "../../Skeletons/PlaylistSkeleton";
import ErrorPage from "../../HelperPages/ErrorPages/ErrorPage";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import useFetchUserDetails from "../../hooks/useFetchUserDetails";

import { useSearchParams } from "react-router-dom";
import EmptyHomePage from "../../HelperPages/EmptyPages/EmptyHomepage";
import useFetchMostListened from "../../hooks/UserPrefs/useFetchMostListened";
import { songsSelector } from "../../redux/selectors/homepage.selector";
import MostPlayedSong from "./MostPlayedSong";

const MostPlayedList = () => {
  const { userLoading, userError } = useFetchUserDetails();
  const { mostListenedLoading, mostListenedError } = useFetchMostListened();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const songsList = useSelector(songsSelector);
  const start = (page - 1) * 20;
  const end = start + 20;

  const handleSetPage = (_event, value) => {
    setSearchParams({ page: value }, { replace: true });
  };

  if (userLoading || mostListenedLoading || !songsList)
    return <PlaylistSkeleton />;
  if (userError || mostListenedError) return <ErrorPage />;

  return (
    <Grid2 className={styles.recent_songs}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Songs in Most Played
        </Typography>
      </Grid2>
      <Grid2 className={styles.songs_container}>
        {songsList.length > 0 ? (
          <>
            <Grid2 className={styles.song_list}>
              {songsList?.slice(start, end).map((song) => (
                <MostPlayedSong
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

export default MostPlayedList;
