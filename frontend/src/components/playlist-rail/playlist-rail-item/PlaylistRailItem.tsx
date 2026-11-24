import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { PlaylistRailItemProps } from "./types/PlaylistRailItem.types";
import styles from "./playlistRailItem.module.css";
import { Link } from "react-router-dom";
import PlaylistRailItemMenu from "../playlist-rail-item-menu/PlaylistRailItemMenu";
import { getUserPlaylistRailCover } from "../utils/playlistRail.utils";
import usePlaylistRailItem from "./hooks/usePlaylistRailItem";
const PlaylistRailItem = ({ playlist, type }: PlaylistRailItemProps) => {
  const playlistRailItemProps = usePlaylistRailItem();
  const showMenu = type === "user";
  const playlistCover = getUserPlaylistRailCover(playlist?.playlist_cover_art);
  return (
    <div className={styles.playlist_card_container}>
      <Link
        className={styles.playlist_card}
        to={playlist.path ?? `/playlists/${playlist.playlist_id}?page=1`}
      >
        <img
          loading="lazy"
          className={styles.playlist_image}
          src={playlistCover}
          alt=""
        />
        <Grid className={styles.playlist_content}>
          <Typography
            variant="homepageSongTitle"
            className={styles.playlist_title}
          >
            {playlist?.playlist_title}
          </Typography>
        </Grid>
      </Link>

      {showMenu ? (
        <Grid className={styles.playlist_actions}>
          <PlaylistRailItemMenu
            playlistRailItemProps={playlistRailItemProps}
            playlist={playlist}
          />
        </Grid>
      ) : null}
    </div>
  );
};
export default PlaylistRailItem;
