import Grid2 from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import styles from "./homepagePlaylistItem.module.css";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deletePlaylistDetails } from "../../redux/slices/homepage.slice";
import axios from "axios";
import RenamePlaylistTitle from "./RenamePlaylistTitle";
import ShowMessage from "../../DialogBoxes/ShowMessage";

const HomepagePlaylistItem = ({ playlistKey, playlistItem }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const dispatch = useDispatch();

  const [cantDeleteModal, setCantDeleteModal] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeletePlaylist = async () => {
    try {
      setDeleteLoading(true);

      await axios.post(
        "/api/deletePlaylist",
        { playlist_id: playlistKey },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(deletePlaylistDetails(playlistKey));
    } catch (error) {
      setCantDeleteModal(true);
      console.error("Error deleting Playlist", error);
    } finally {
      setDeleteLoading(false);
      handleMenuClose();
    }
  };

  const handleRenameSong = () => {
    setRenameLoading(true);
    handleMenuClose();
  };

  const handlePlaylistClick = () => {
    navigate(`/playlists/${playlistKey}`);
  };

  return (
    <>
      <div className={styles.playlist_card_container}>
        <div className={styles.playlist_card} onClick={handlePlaylistClick}>
          <img
            className={styles.playlist_image}
            src={playlistItem?.playlist_cover_art}
            alt=""
          />
          <Grid2 className={styles.playlist_content}>
            <Grid2>
              <Typography
                variant="homepageSongTitle"
                className={styles.playlist_title}
              >
                {playlistItem?.playlist_title}
              </Typography>
            </Grid2>
          </Grid2>
        </div>
        <Grid2 className={styles.playlist_actions}>
          <IconButton onClick={handleMenuOpen} sx={{ color: "White" }}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            slotProps={{
              root: { sx: { ".MuiList-root": { padding: 0 } } },
            }}
          >
            <MenuItem
              disabled={deleteLoading || renameLoading}
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
              disabled={renameLoading || deleteLoading}
              onClick={handleDeletePlaylist}
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
      </div>
      <ShowMessage
        open={cantDeleteModal}
        onClose={() => setCantDeleteModal(false)}
        messageTitle="Cant delete Playlist!"
        message="Please delete the songs in the playlist before proceeding"
      />
      <RenamePlaylistTitle
        open={renameLoading}
        onClose={() => setRenameLoading(false)}
        playlistId={playlistKey}
        playlistTitle={playlistItem.playlist_title}
      />
    </>
  );
};

export default HomepagePlaylistItem;
