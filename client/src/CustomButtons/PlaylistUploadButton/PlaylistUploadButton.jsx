import { useState } from "react";
import ButtonBase from "@mui/material/ButtonBase";
import uploadButton from "../../assets/images/Homepage/UploadIcon.jpg";
import styles from "./playlistUploadButton.module.css";
import PlaylistUploadForm from "../../AudioUploadForm/PlaylistUploadForm";

const showButoonForCollections = ["user-playlist"];
const PlaylistUploadButton = ({ collection, playlistId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  if (!showButoonForCollections.includes(collection)) return null;

  return (
    <div>
      <ButtonBase onClick={openModal}>
        <img
          loading="lazy"
          src={uploadButton}
          className={styles.upload_button}
          alt=""
        />
      </ButtonBase>

      <PlaylistUploadForm
        playlistId={playlistId}
        open={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default PlaylistUploadButton;
