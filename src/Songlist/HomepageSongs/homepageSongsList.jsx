import HomepageSong from "./HomepageSong";
import Grid2 from "@mui/material/Grid2";
import styles from "./homepageSongsList.module.css";

const HomepageSongsList = ({ songsList }) => {
  return (
    <Grid2 className={styles.song_list}>
      {Object.entries(songsList).map(([key, value]) => (
        <HomepageSong key={key} songKey={key} song={value} />
      ))}
    </Grid2>
  );
};

export default HomepageSongsList;
