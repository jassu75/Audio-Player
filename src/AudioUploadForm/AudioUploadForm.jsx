import React from "react";
import { Modal, Box } from "@mui/material";
import * as musicMetadata from "music-metadata-browser";
import styles from "./AudioForm.module.css";

const AudioUploadForm = ({ open, onClose }) => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "audio/mpeg") {
      try {
        const metadata = await musicMetadata.parseBlob(file);

        const newSong = {
          title: metadata.common.title || file.name.replace(".mp3", ""),
          artist: metadata.common.artist || "",
          album: metadata.common.album || "",
          duration: Math.round(metadata.format.duration || 0),
          genre: metadata.common.genre || "",
          release_year: metadata.common.year || "",
          cover_art: metadata.common.picture
            ? URL.createObjectURL(
                new Blob([metadata.common.picture[0].data], {
                  type: metadata.common.picture[0].format,
                })
              )
            : "",
          audio_url: URL.createObjectURL(file),
        };

        const songsList = JSON.parse(localStorage.getItem("songsList")) || {};

        const nextKey = Object.keys(songsList).length
          ? Math.max(...Object.keys(songsList).map(Number)) + 1
          : 0;

        const updatedSongsList = { ...songsList, [nextKey]: newSong };

        localStorage.setItem("songsList", JSON.stringify(updatedSongsList));
      } catch (error) {
        console.error("Error occurred uploading audio file:", error);
      }
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box className={styles.modal_box}>
        <h2>Upload Audio File</h2>
        <input
          type="file"
          accept="audio/mpeg"
          onChange={handleFileUpload}
          className={styles.file_input}
        />
      </Box>
    </Modal>
  );
};

export default AudioUploadForm;
