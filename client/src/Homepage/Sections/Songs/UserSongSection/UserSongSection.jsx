import { Grid2, Typography } from "@mui/material";
import styles from "./userSongSection.module.css";
import AudioUploadButton from "../../../../CustomButtons/AudioUploadButton";
import HomepageSongsList from "../../../../Songlist/HomepageSongs/homepageSongsList";
import EmptyHomePage from "../../../EmptyPages/EmptyHomepage";
import { useSelector } from "react-redux";

const UserSongSection = () => {
  const homepageSongsList = useSelector(
    (state) => state.homepage?.user?.homepage_songs
  );
  return (
    <Grid2 className={styles.homepage_songs}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Your Songs
        </Typography>
        <AudioUploadButton />
      </Grid2>
      {!homepageSongsList || Object.keys(homepageSongsList).length !== 0 ? (
        <HomepageSongsList songsList={homepageSongsList} />
      ) : (
        <EmptyHomePage />
      )}
    </Grid2>
  );
};

export default UserSongSection;
