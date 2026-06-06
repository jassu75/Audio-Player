import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styles from "./playlistRailItemMenu.module.css";
import MessageModal from "../../helpers/modals/messageModal/MessageModal";
import RenamePlaylistTitle from "../../playlist/actions/playlist/renamePlaylist/RenamePlaylistTitle";

const PlaylistRailItemMenu = ({ playlist, playlistRailItemProps }) => {
  return (
    <>
      <IconButton
        onClick={playlistRailItemProps.handleMenuOpen}
        sx={{ color: "White" }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={playlistRailItemProps.anchorEl}
        open={Boolean(playlistRailItemProps.anchorEl)}
        onClose={playlistRailItemProps.handleMenuClose}
        slotProps={{
          root: { sx: { ".MuiList-root": { padding: 0 } } },
        }}
      >
        <MenuItem
          disabled={playlistRailItemProps.loading !== null}
          onClick={playlistRailItemProps.handleRenameSong}
          className={styles.menu_item}
        >
          {playlistRailItemProps.loading === "rename" ? (
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
          disabled={playlistRailItemProps.loading !== null}
          onClick={() =>
            playlistRailItemProps.handleDeletePlaylist(playlist.playlist_id)
          }
          className={styles.menu_item}
        >
          {playlistRailItemProps.loading === "delete" ? (
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

      <MessageModal
        open={playlistRailItemProps.cantDeleteModal}
        onClose={() => playlistRailItemProps.setCantDeleteModal(false)}
        messageTitle="Cant delete Playlist!"
        message="Please delete the songs in the playlist before proceeding"
      />

      <RenamePlaylistTitle
        open={playlistRailItemProps.loading === "rename"}
        onClose={() => playlistRailItemProps.handleRenameSong(null)}
        playlistId={playlist.playlist_id}
        playlistTitle={playlist.playlist_title}
      />
    </>
  );
};

export default PlaylistRailItemMenu;
