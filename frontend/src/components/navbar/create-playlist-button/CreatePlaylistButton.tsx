import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CreatePlaylistTitle from "../../playlist/actions/playlist/create-playlist/CreatePlaylistTitle";
import styles from "./createPlaylistButton.module.css";
const CreatePlaylistButton = () => {
    const [isPlaylistModalOpen, setPlaylistModalOpen] = useState(false);
    const closePlaylistModal = () => setPlaylistModalOpen(false);
    const handleUploadPlaylist = () => {
        setPlaylistModalOpen(true);
    };
    return (<>
      <Grid className={styles.upload_actions}>
        <IconButton onClick={handleUploadPlaylist}>
          <AddIcon className={styles.upload_button}/>
        </IconButton>
      </Grid>

      <CreatePlaylistTitle open={isPlaylistModalOpen} onClose={closePlaylistModal}/>
    </>);
};
export default CreatePlaylistButton;
