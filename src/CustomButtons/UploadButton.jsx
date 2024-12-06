import FileUploadRounded from "@mui/icons-material/FileUploadRounded";
import styles from "./uploadButton.module.css";
import { useState } from "react";
import AudioUploadForm from "../AudioUploadForm/AudioUploadForm";
import ButtonBase from "@mui/material/ButtonBase";
import Grid2 from "@mui/material/Grid2";
import { Typography } from "@mui/material";

const UploadButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <ButtonBase onClick={openModal}>
        <Grid2 className={styles.button_container}>
          <Grid2 className={styles.button}>
            <FileUploadRounded className={styles.icon} />
          </Grid2>
          <Grid2 className={styles.button_text_container}>
            <Typography variant="UploadSongText" className={styles.button_text}>
              UPLOAD
            </Typography>
          </Grid2>
        </Grid2>
      </ButtonBase>

      {isModalOpen && (
        <AudioUploadForm open={isModalOpen} onClose={closeModal} />
      )}
    </div>
  );
};
export default UploadButton;
