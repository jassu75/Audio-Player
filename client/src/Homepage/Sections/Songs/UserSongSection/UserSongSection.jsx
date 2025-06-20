import Grid2 from "@mui/material/Grid2";
import styles from "./userSongSection.module.css";
import EmptyHomePage from "../../../../HelperPages/EmptyPages/EmptyHomepage";
import { useSelector } from "react-redux";
import HomepageSong from "../../../../Songlist/HomepageSongs/HomepageSong";
import {
  songsSelector,
  userSongsSelector,
} from "../../../../redux/selectors/homepage.selector";

const UserSongSection = () => {
  const userSongs = useSelector(userSongsSelector);
  const allSongs = useSelector(songsSelector);

  return (
    <Grid2 className={styles.homepage_songs}>
      {userSongs && Object.keys(userSongs).length !== 0 ? (
        <Grid2 className={styles.song_list}>
          {userSongs.map((songId) => (
            <HomepageSong
              key={songId}
              songKey={songId}
              song={allSongs?.[songId]}
            />
          ))}
        </Grid2>
      ) : (
        <EmptyHomePage />
      )}
    </Grid2>
  );
};

export default UserSongSection;
