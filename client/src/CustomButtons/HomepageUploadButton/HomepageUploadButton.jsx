import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import styles from "./homepageUploadButton.module.css";
import { useState } from "react";
import CreatePlaylistTitle from "../../Songlist/HomepagePlaylists/CreatePlaylistTitle";
import AudioUploadform from "../../AudioUploadForm/AudioUploadForm";

const HomepageUploadButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const [isSongModalOpen, setSongModalOpen] = useState(false);
  const closeSongModal = () => setSongModalOpen(false);

  const [isPlaylistModalOpen, setPlaylistModalOpen] = useState(false);
  const closePlaylistModal = () => setPlaylistModalOpen(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUploadSong = () => {
    setSongModalOpen(true);
    handleMenuClose();
  };

  const handleUploadPlaylist = () => {
    setPlaylistModalOpen(true);
    handleMenuClose();
  };
  return (
    <>
      <Grid2 className={styles.upload_actions}>
        <IconButton onClick={handleMenuOpen}>
          <AddIcon className={styles.upload_button} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleUploadSong} className={styles.menu_item}>
            <Typography variant="MenuItemText">Upload Song</Typography>
          </MenuItem>
          <Divider className={styles.divider} />

          <MenuItem onClick={handleUploadPlaylist} className={styles.menu_item}>
            <Typography variant="MenuItemText">Upload Playlist</Typography>
          </MenuItem>
        </Menu>
      </Grid2>
      <AudioUploadform open={isSongModalOpen} onClose={closeSongModal} />

      <CreatePlaylistTitle
        open={isPlaylistModalOpen}
        onClose={closePlaylistModal}
      />
    </>
  );
};

export default HomepageUploadButton;
