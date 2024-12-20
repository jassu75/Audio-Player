import HomepageSong from "./HomepageSong";
import Grid2 from "@mui/material/Grid2";
import styles from "./homepageSongsList.module.css";
import { useSelector } from "react-redux";

const HomepageSongsList = ({ songsList }) => {
  const allSongs = useSelector((state) => state.homepage.songs);

  return (
    <Grid2 className={styles.song_list}>
      {songsList
        ? songsList.map((value) => (
            <HomepageSong key={value} songKey={value} song={allSongs[value]} />
          ))
        : null}
    </Grid2>
  );
};

export default HomepageSongsList;
