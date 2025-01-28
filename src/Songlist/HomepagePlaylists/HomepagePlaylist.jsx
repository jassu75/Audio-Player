import Grid2 from "@mui/material/Grid2";
import styles from "./homepagePlaylist.module.css";
import { useSelector } from "react-redux";
import HomepagePlaylistItem from "./HomepagePlaylistItem";

const HomepagePlaylist = ({ playlistDetails }) => {
    const allPlaylistSongs = useSelector((state) => state.homepage.playlists);

    return (
        <Grid2 className={styles.playlist_list}>
            {playlistDetails
                ? playlistDetails.map((value) => (
                    <HomepagePlaylistItem key={value} playlistKey={value} playlistItem={allPlaylistSongs[value]} />
                ))
                : null}
        </Grid2>
    );
};

export default HomepagePlaylist;
