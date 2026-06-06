import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import styles from "./playlistRail.module.css";
import PlaylistRailItem from "./playlistRailItem/PlaylistRailItem";

const PlaylistRail = ({ collection }) => {
  if (!collection || collection.length === 0) {
    return null;
  }

  return (
    <Grid2 className={styles.homepage_playlists}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          {collection.title}
        </Typography>
      </Grid2>

      <Grid2 className={styles.playlists}>
        {collection.collection.map((playlist) => (
          <PlaylistRailItem
            key={playlist.playlist_id}
            playlist={playlist}
            type={collection.type}
          />
        ))}
      </Grid2>
    </Grid2>
  );
};

export default PlaylistRail;
