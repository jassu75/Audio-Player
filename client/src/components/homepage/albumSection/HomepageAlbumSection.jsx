import { Grid2, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import styles from "./homepageAlbumSection.module.css";
import HomepageAlbum from "./album/HomepageAlbum";
import { audiusPlaylistsSelector } from "../../../redux/selectors/homepage.selector";

const HomepageAlbumSection = () => {
  const audiusPlaylists = useSelector(audiusPlaylistsSelector);
  return (
    <Grid2 className={styles.homepage_albums}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Popular Albums
        </Typography>
      </Grid2>
      <Grid2 className={styles.album_list}>
        {audiusPlaylists
          ? Object.values(audiusPlaylists).map((album) => (
              <HomepageAlbum key={album.id} albumKey={album.id} album={album} />
            ))
          : null}
      </Grid2>
    </Grid2>
  );
};

export default HomepageAlbumSection;
