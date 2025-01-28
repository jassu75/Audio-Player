import { useState } from "react";
import ButtonBase from "@mui/material/ButtonBase";
import uploadButton from "../assets/Homepage/UploadIcon.jpg"
import styles from "./playlistCreationButton.module.css"
import CreatePlaylistTitle from "../Songlist/HomepagePlaylists/CreatePlaylistTitle";

const PlaylistUploadButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <ButtonBase onClick={openModal}>
                <img src={uploadButton} className={styles.upload_button} alt=""></img>
            </ButtonBase>

            {isModalOpen && (
                <CreatePlaylistTitle open={isModalOpen} onClose={closeModal} />
            )}
        </div>
    );
};
export default PlaylistUploadButton;
