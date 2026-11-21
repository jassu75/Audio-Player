import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Divider, Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import type { PlaylistSongMenuProps } from "./types/PlaylistSongMenu.types";
import MoveSong from "../../../actions/song/move-song/MoveSong";
import RenameSongTitle from "../../../actions/song/rename-song/RenameSongTitle";
import usePlaylistSongMenu from "./hooks/usePlaylistSongMenu";
import styles from "./playlistSongMenu.module.css";
const PlaylistSongMenu = ({ song, playlistId }: PlaylistSongMenuProps) => {
    const { anchorEl, deleteLoading, renameLoading, moveLoading, handleMenuOpen, handleMenuClose, handleDeleteSong, handleRenameSong, handleMove, closeRenameModal, closeMoveModal, } = usePlaylistSongMenu({
        song,
        playlistId,
    });
    return (<>
      <Grid className={styles.song_actions}>
        <IconButton onClick={handleMenuOpen} className={styles.icon}>
          <MoreVertIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} slotProps={{
            root: {
                sx: {
                    ".MuiList-root": {
                        padding: 0,
                    },
                },
            },
        }}>
          <MenuItem disabled={deleteLoading || renameLoading || moveLoading} onClick={handleMove} className={styles.menu_item}>
            {moveLoading ? (<>
                <Typography variant="MenuItemText">Moving</Typography>
                <CircularProgress className={styles.loader} size={20}/>
              </>) : (<Typography variant="MenuItemText">Move</Typography>)}
          </MenuItem>

          <Divider className={styles.divider}/>

          <MenuItem disabled={deleteLoading || renameLoading || moveLoading} onClick={handleRenameSong} className={styles.menu_item}>
            {renameLoading ? (<>
                <Typography variant="MenuItemText">Renaming</Typography>
                <CircularProgress className={styles.loader} size={20}/>
              </>) : (<Typography variant="MenuItemText">Rename</Typography>)}
          </MenuItem>

          <Divider className={styles.divider}/>

          <MenuItem disabled={deleteLoading || renameLoading || moveLoading} onClick={handleDeleteSong} className={styles.menu_item}>
            {deleteLoading ? (<>
                <Typography variant="MenuItemText" className={styles.delete_item_text}>
                  Deleting
                </Typography>
                <CircularProgress className={styles.loader} size={20}/>
              </>) : (<Typography variant="MenuItemText" className={styles.delete_item_text}>
                Delete
              </Typography>)}
          </MenuItem>
        </Menu>
      </Grid>

      <RenameSongTitle open={renameLoading} onClose={closeRenameModal} songId={song.song_id} songTitle={song.title}/>

      <MoveSong open={moveLoading} onClose={closeMoveModal} songId={song.song_id} playlistId={playlistId}/>
    </>);
};
export default PlaylistSongMenu;
