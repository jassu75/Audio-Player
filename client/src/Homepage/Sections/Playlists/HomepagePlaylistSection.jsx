import { Grid2, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import styles from "./homepagePlaylistSection.module.css";
import HomepagePlaylist from "../../../Songlist/HomepagePlaylists/HomepagePlaylist";

const HomepagePlaylistSection = () => {
  const homepagePlaylists = useSelector(
    (state) => state.homepage?.user?.playlist_ids
  );
  return !homepagePlaylists || Object.keys(homepagePlaylists).length !== 0 ? (
    <Grid2 className={styles.homepage_playlists}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Your Playlists
        </Typography>
      </Grid2>
      <HomepagePlaylist playlistDetails={homepagePlaylists} />
    </Grid2>
  ) : null;
};

export default HomepagePlaylistSection;
