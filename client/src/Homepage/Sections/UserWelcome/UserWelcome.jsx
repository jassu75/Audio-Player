import Typography from "@mui/material/Typography";
import styles from "./userWelcome.module.css";
import useFetchUserDetails from "../../../hooks/useFetchUserDetails";
import Grid2 from "@mui/material/Grid2";
import Avatar from "@mui/material/Avatar";
import defaultAvatar from "../../../assets/Homepage/DefaultAvatar.jpeg";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import AudioUploadform from "../../../AudioUploadForm/AudioUploadForm";
import CreatePlaylistTitle from "../../../Songlist/HomepagePlaylists/CreatePlaylistTitle";

const UserWelcome = () => {
  useFetchUserDetails();
  const user = useSelector((state) => state.homepage.user);
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

  return user ? (
    <>
      <Grid2 className={styles.user_welcome_container}>
        <Grid2 className={styles.welcome_text_container}>
          <Avatar src={defaultAvatar} />
          <Typography
            variant="UserWelcomeText"
            className={styles.username_text}
          >
            {user.username}
          </Typography>
        </Grid2>
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
              <Typography
                variant="MenuItemText"
                className={styles.menu_item_text}
              >
                Upload Song
              </Typography>
            </MenuItem>
            <Divider className={styles.divider} />

            <MenuItem
              onClick={handleUploadPlaylist}
              className={styles.menu_item}
            >
              <Typography
                variant="MenuItemText"
                className={styles.menu_item_text}
              >
                Upload Playlist
              </Typography>
            </MenuItem>
          </Menu>
        </Grid2>
      </Grid2>
      {isSongModalOpen && (
        <AudioUploadform open={isSongModalOpen} onClose={closeSongModal} />
      )}

      {isPlaylistModalOpen && (
        <CreatePlaylistTitle
          open={isPlaylistModalOpen}
          onClose={closePlaylistModal}
        />
      )}
    </>
  ) : null;
};

export default UserWelcome;
