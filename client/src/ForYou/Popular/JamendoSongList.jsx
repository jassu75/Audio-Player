import Grid2 from "@mui/material/Grid2";
import styles from "./jamendoSongList.module.css";
import JamendoSong from "./JamendoSong";
import { useSelector } from "react-redux";
import { songsSelector } from "../../redux/selectors/homepage.selector";
import useJamendoSongs from "../../hooks/Songs/useJamendoSongs";
import PlaylistSkeleton from "../../Skeletons/PlaylistSkeleton";
import ErrorPage from "../../HelperPages/ErrorPages/ErrorPage";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import { useSearchParams } from "react-router-dom";

const JamendoSongList = () => {
  const { jamendoSongsLoading, jamendoSongsError } = useJamendoSongs();
  const songsList = useSelector(songsSelector);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const start = (page - 1) * 20;
  const end = start + 20;

  const handleSetPage = (_event, value) => {
    setSearchParams({ page: value }, { replace: true });
  };

  if (jamendoSongsLoading || !songsList) return <PlaylistSkeleton />;
  if (jamendoSongsError) return <ErrorPage />;

  return (
    <Grid2 className={styles.jamendo_songs}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Songs in Popular
        </Typography>
      </Grid2>
      <Grid2 className={styles.songs_container}>
        <Grid2 className={styles.song_list}>
          {songsList?.slice(start, end).map((song) => (
            <JamendoSong
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
      </Grid2>
    </Grid2>
  );
};

export default JamendoSongList;
