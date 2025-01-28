import React from "react";
import useHomepageSongs from "../hooks/useHomepageSongs";
import HomepageSongsList from "../Songlist/HomepageSongs/homepageSongsList";
import Grid2 from "@mui/material/Grid2";
import styles from "./homepage.module.css";
import { useSelector } from "react-redux";
import UserWelcome from "./UserWelcome";
import Typography from "@mui/material/Typography";
import { Backdrop, CircularProgress } from "@mui/material";
import ErrorPage from "./ErrorPage";
import useHomepagePlaylists from "../hooks/useHomepagePlaylists";
import HomepagePlaylist from "../Songlist/HomepagePlaylists/HomepagePlaylist";
import PlaylistUploadButton from "../CustomButtons/PlaylistCreationButton";
import AudioUploadButton from "../CustomButtons/AudioUploadButton";
import EmptyHomePage from "./EmptyHomepage";

const Homepage = () => {
  const { homepageSongsLoading, homepageSongsError } = useHomepageSongs();
  const { homepagePlaylistsLoading, homepagePlaylistsError } = useHomepagePlaylists();

  const loading = homepageSongsLoading || homepagePlaylistsLoading;
  const error = homepageSongsError || homepagePlaylistsError;


  const homepageSongsList = useSelector(
    (state) => state.homepage?.user?.homepage_songs
  );

  const homepagePlaylists = useSelector((state) => state.homepage?.user?.playlist_ids)

  if (loading)
    return (
      <Backdrop className={styles.loader_backdrop} open={loading}>
        <CircularProgress className={styles.loader_spinner} />
      </Backdrop>
    );
  if (error) return <ErrorPage />;

  return (
    <Grid2 className={styles.container}>
      <UserWelcome />

      <Grid2 className={styles.homepage_playlists}>
        <Grid2 className={styles.title}>
          <Typography variant="HomepageTitleText" className={styles.title_text}>
            Your Playlists
          </Typography>
          <PlaylistUploadButton />
        </Grid2>
        {!homepagePlaylists || Object.keys(homepagePlaylists).length !== 0 ?
          <HomepagePlaylist playlistDetails={homepagePlaylists} /> : <EmptyHomePage />
        }
      </Grid2>

      <Grid2 className={styles.homepage_songs}>
        <Grid2 className={styles.title}>
          <Typography variant="HomepageTitleText" className={styles.title_text}>
            Your Songs
          </Typography>
          <AudioUploadButton />
        </Grid2>
        {!homepageSongsList || Object.keys(homepageSongsList).length !== 0 ?
          <HomepageSongsList songsList={homepageSongsList} /> : <EmptyHomePage />
        }
      </Grid2>
    </Grid2>
  );
};

export default Homepage;
