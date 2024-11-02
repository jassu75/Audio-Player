import HomepageSong from "./HomepageSong";
import Grid2 from "@mui/material/Grid2";
import styles from "./homepageSongsList.module.css"

const HomepageSongsList = ({ songsList }) => {
    return (
        <Grid2 className={styles.song_list}>
            {songsList.map((song, index) => (
                <HomepageSong key={index} song={song} />
            ))}
        </Grid2>
    );
};

export default HomepageSongsList;