import ButtonBase from "@mui/material/ButtonBase";
import { useState } from "react";
import uploadButton from "../../../../assets/images/Homepage/UploadIcon.jpg";
import type { PlaylistUploadButtonProps } from "./types/PlaylistUploadButton.types";
import PlaylistUploadForm from "../../actions/playlist/upload-playlist/PlaylistUploadForm";
import styles from "./playlistUploadButton.module.css";
const PlaylistUploadButton = ({ type, playlistId }: PlaylistUploadButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const hide = type !== "user";
    if (hide)
        return null;
    return (<div>
      <ButtonBase onClick={openModal}>
        <img loading="lazy" src={uploadButton} className={styles.upload_button} alt=""/>
      </ButtonBase>

      <PlaylistUploadForm playlistId={playlistId} open={isModalOpen} onClose={closeModal}/>
    </div>);
};
export default PlaylistUploadButton;
