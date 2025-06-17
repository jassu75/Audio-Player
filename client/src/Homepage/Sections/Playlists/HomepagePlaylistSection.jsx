import { Grid2, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import styles from "./homepagePlaylistSection.module.css";
import HomepagePlaylistItem from "../../../Songlist/HomepagePlaylists/HomepagePlaylistItem";
import { playlistsSelector } from "../../../redux/selectors/homepage.selector";

const HomepagePlaylistSection = () => {
  const homepagePlaylists = useSelector(playlistsSelector);
  return homepagePlaylists && Object.keys(homepagePlaylists).length !== 0 ? (
    <Grid2 className={styles.homepage_playlists}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Your Playlists
        </Typography>
      </Grid2>
      <Grid2 className={styles.playlist_list}>
        {Object.entries(homepagePlaylists).map(
          ([playlistId, playlistDetails]) => (
            <HomepagePlaylistItem
              key={playlistId}
              playlistKey={playlistId}
              playlistItem={playlistDetails}
            />
          )
        )}
      </Grid2>
    </Grid2>
  ) : null;
};

export default HomepagePlaylistSection;
