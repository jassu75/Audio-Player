import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { PlaylistRailProps } from "./types/PlaylistRail.types";
import PlaylistRailItem from "./playlist-rail-item/PlaylistRailItem";
import styles from "./playlistRail.module.css";
const PlaylistRail = ({ collection }: PlaylistRailProps) => {
    if (!collection || collection.collection?.length === 0) {
        return null;
    }
    return (<Grid className={styles.homepage_playlists}>
      <Grid className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          {collection.title}
        </Typography>
      </Grid>

      <Grid className={styles.playlists}>
        {collection.collection.map((playlist) => (<PlaylistRailItem key={playlist.playlist_id} playlist={playlist} type={collection.type}/>))}
      </Grid>
    </Grid>);
};
export default PlaylistRail;
