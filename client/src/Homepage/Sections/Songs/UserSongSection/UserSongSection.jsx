import Grid2 from "@mui/material/Grid2";
import styles from "./userSongSection.module.css";
import HomepageSongsList from "../../../../Songlist/HomepageSongs/homepageSongsList";
import EmptyHomePage from "../../../../HelperPages/EmptyPages/EmptyHomepage";
import { useSelector } from "react-redux";

const UserSongSection = () => {
  const homepageSongsList = useSelector(
    (state) => state.homepage?.user?.homepage_songs
  );
  return (
    <Grid2 className={styles.homepage_songs}>
      {!homepageSongsList || Object.keys(homepageSongsList).length !== 0 ? (
        <HomepageSongsList songsList={homepageSongsList} />
      ) : (
        <EmptyHomePage />
      )}
    </Grid2>
  );
};

export default UserSongSection;
