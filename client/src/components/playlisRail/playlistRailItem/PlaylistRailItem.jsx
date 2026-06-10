import Grid2 from "@mui/material/Grid2";
import styles from "./playlistRailItem.module.css";
import Typography from "@mui/material/Typography";

import usePlaylistRailItem from "./hooks/usePlaylistRailItem";
import PlaylistRailItemMenu from "../playlistRailItemMenu/PlaylistRailItemMenu";
import { useNavigate } from "react-router-dom";
import { getUserPlaylistRailCover } from "../utils/playlistRail.utils";

const PlaylistRailItem = ({ playlist, type }) => {
  const playlistRailItemProps = usePlaylistRailItem();
  const showMenu = type === "user";
  const navigate = useNavigate();

  const handlePlaylistRailItemClick = () => {
    navigate(`/playlists/${playlist.playlist_id}?page=1`);
  };

  const playlistCover = getUserPlaylistRailCover(playlist?.playlist_cover_art);

  return (
    <div className={styles.playlist_card_container}>
      <div
        className={styles.playlist_card}
        onClick={handlePlaylistRailItemClick}
      >
        <img
          loading="lazy"
          className={styles.playlist_image}
          src={playlistCover}
          alt=""
        />
        <Grid2 className={styles.playlist_content}>
          <Typography
            variant="homepageSongTitle"
            className={styles.playlist_title}
          >
            {playlist?.playlist_title}
          </Typography>
        </Grid2>
      </div>

      {showMenu ? (
        <Grid2 className={styles.playlist_actions}>
          <PlaylistRailItemMenu
            playlistRailItemProps={playlistRailItemProps}
            playlist={playlist}
          />
        </Grid2>
      ) : null}
    </div>
  );
};

export default PlaylistRailItem;
