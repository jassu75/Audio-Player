import { useState } from "react";
import ButtonBase from "@mui/material/ButtonBase";
import uploadButton from "../assets/Homepage/UploadIcon.jpg"
import styles from "./playlistUploadButton.module.css"
import PlaylistUploadForm from "../AudioUploadForm/PlaylistUploadForm";
const PlaylistUploadButton = ({ playlistId }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <ButtonBase onClick={openModal}>
                <img src={uploadButton} className={styles.upload_button} alt=""></img>
            </ButtonBase>

            {isModalOpen && (
                <PlaylistUploadForm playlistId={playlistId} open={isModalOpen} onClose={closeModal} />
            )}
        </div>
    );
}

export default PlaylistUploadButton;