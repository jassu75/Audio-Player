import React from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CircularProgress from "@mui/material/CircularProgress";
import { Divider, Grid2 } from "@mui/material";
import FavoriteIcon from "../../../../favorites/favoritesIcon/FavoriteIcon";
import RenameSongTitle from "../../../actions/song/renameSong/RenameSongTitle";
import MoveSong from "../../../actions/song/moveSong/MoveSong";
import styles from "./playlistSongMenu.module.css";
import usePlaylistSongMenu from "./hooks/usePlaylistSongMenu";

const PlaylistSongMenu = ({ song, playlistId }) => {
  const {
    anchorEl,
    deleteLoading,
    renameLoading,
    moveLoading,
    handleMenuOpen,
    handleMenuClose,
    handleDeleteSong,
    handleRenameSong,
    handleMove,
    closeRenameModal,
    closeMoveModal,
  } = usePlaylistSongMenu({
    song,
    playlistId,
  });

  return (
    <>
      <Grid2 className={styles.song_actions}>
        <FavoriteIcon songId={song.song_id} />

        <IconButton onClick={handleMenuOpen} className={styles.icon}>
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          slotProps={{
            root: {
              sx: {
                ".MuiList-root": {
                  padding: 0,
                },
              },
            },
          }}
        >
          <MenuItem
            disabled={deleteLoading || renameLoading || moveLoading}
            onClick={handleMove}
            className={styles.menu_item}
          >
            {moveLoading ? (
              <>
                <Typography variant="MenuItemText">Moving</Typography>
                <CircularProgress className={styles.loader} size={20} />
              </>
            ) : (
              <Typography variant="MenuItemText">Move</Typography>
            )}
          </MenuItem>

          <Divider className={styles.divider} />

          <MenuItem
            disabled={deleteLoading || renameLoading || moveLoading}
            onClick={handleRenameSong}
            className={styles.menu_item}
          >
            {renameLoading ? (
              <>
                <Typography variant="MenuItemText">Renaming</Typography>
                <CircularProgress className={styles.loader} size={20} />
              </>
            ) : (
              <Typography variant="MenuItemText">Rename</Typography>
            )}
          </MenuItem>

          <Divider className={styles.divider} />

          <MenuItem
            disabled={deleteLoading || renameLoading || moveLoading}
            onClick={handleDeleteSong}
            className={styles.menu_item}
          >
            {deleteLoading ? (
              <>
                <Typography
                  variant="MenuItemText"
                  className={styles.delete_item_text}
                >
                  Deleting
                </Typography>
                <CircularProgress className={styles.loader} size={20} />
              </>
            ) : (
              <Typography
                variant="MenuItemText"
                className={styles.delete_item_text}
              >
                Delete
              </Typography>
            )}
          </MenuItem>
        </Menu>
      </Grid2>

      <RenameSongTitle
        open={renameLoading}
        onClose={closeRenameModal}
        songId={song.song_id}
        songTitle={song.title}
      />

      <MoveSong
        open={moveLoading}
        onClose={closeMoveModal}
        songId={song.song_id}
        playlistId={playlistId}
      />
    </>
  );
};

export default PlaylistSongMenu;
