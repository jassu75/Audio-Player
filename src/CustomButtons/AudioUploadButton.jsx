import { useState } from "react";
import ButtonBase from "@mui/material/ButtonBase";
import uploadButton from "../assets/Homepage/UploadIcon.jpg"
import styles from "./audioUploadButton.module.css"
import AudioUploadForm from "../AudioUploadForm/AudioUploadForm";

const AudioUploadButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <ButtonBase onClick={openModal}>
        <img src={uploadButton} className={styles.upload_button} alt=""></img>
      </ButtonBase>

      {isModalOpen && (
        <AudioUploadForm open={isModalOpen} onClose={closeModal} />
      )}
    </div>
  );
};
export default AudioUploadButton;
