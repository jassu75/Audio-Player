import { Grid2, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import styles from "./homepageAlbumSection.module.css";
import HomepageAlbum from "./HomepageAlbum";

const HomepageAlbumSection = () => {
  const homepageAlbumList = useSelector((state) => state.homepage.audiusAlbums);
  return (
    <Grid2 className={styles.homepage_albums}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Popular Albums
        </Typography>
      </Grid2>
      <Grid2 className={styles.album_list}>
        {homepageAlbumList
          ? homepageAlbumList.map((album) => (
              <HomepageAlbum key={album.id} albumKey={album.id} album={album} />
            ))
          : null}
      </Grid2>
    </Grid2>
  );
};

export default HomepageAlbumSection;
