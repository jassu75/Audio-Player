import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";

import AddIcon from "@mui/icons-material/Add";
import styles from "./homepageUploadButton.module.css";
import { useState } from "react";
import CreatePlaylistTitle from "../../Songlist/HomepagePlaylists/CreatePlaylistTitle";

const HomepageUploadButton = () => {
  const [isPlaylistModalOpen, setPlaylistModalOpen] = useState(false);
  const closePlaylistModal = () => setPlaylistModalOpen(false);

  const handleUploadPlaylist = () => {
    setPlaylistModalOpen(true);
  };
  return (
    <>
      <Grid2 className={styles.upload_actions}>
        <IconButton onClick={handleUploadPlaylist}>
          <AddIcon className={styles.upload_button} />
        </IconButton>
      </Grid2>

      <CreatePlaylistTitle
        open={isPlaylistModalOpen}
        onClose={closePlaylistModal}
      />
    </>
  );
};

export default HomepageUploadButton;
