import React, { useState } from "react";
import { Modal, Grid2 } from "@mui/material";
import * as musicMetadata from "music-metadata-browser";
import { useMutation } from "@apollo/client";
import { ADD_SONG } from "../mutations";
import useCloudinaryAudioUpload from "./useCloudinaryAudioUpload";
import useCloudinaryImageUpload from "./useCloudinaryImageUpload";
import styles from "./AudioForm.module.css";

const AudioUploadForm = ({ open, onClose }) => {
  const { uploadAudioToCloudinary, loading: audioLoading } =
    useCloudinaryAudioUpload();
  const { uploadImageToCloudinary, loading: imageLoading } =
    useCloudinaryImageUpload();
  const [errorMessage, setErrorMessage] = useState("");

  const [addSong, { loading: mutationLoading, error: mutationError }] =
    useMutation(ADD_SONG);

  const handleAudioUpload = async (event) => {
    const file = event.target.files[0];

    if (!file || !file.type.startsWith("audio/")) {
      setErrorMessage("Invalid file chosen. Select correct file");
      return;
    }

    try {
      const audioUrl = await uploadAudioToCloudinary(file);

      const metadata = await musicMetadata.parseBlob(file);
      const image = metadata.common.picture
        ? metadata.common.picture[0].data
        : null;

      const imageUrl = await uploadImageToCloudinary(
        new Blob([image], { type: "image/jpeg" })
      );
      const newSong = {
        title: metadata.common.title || file.name.replace(".mp3", ""),
        artist: metadata.common.artist || "",
        album: metadata.common.album || "",
        duration: Math.round(metadata.format.duration || 0),
        genre: metadata.common.genre || "",
        release_year: String(metadata.common.year) || "",
        cover_art: imageUrl,
        audio_url: audioUrl,
      };

      await addSong({ variables: newSong });
      alert("Audio and image uploaded successfully!");
    } catch (error) {
      console.error("Error occurred:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Grid2 className={styles.modal_box}>
        <h2>Upload Audio File</h2>
        <input
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
          className={styles.file_input}
        />
        {errorMessage && <p className={styles.error_text}>{errorMessage}</p>}
        {(audioLoading || imageLoading || mutationLoading) && (
          <p>Uploading...</p>
        )}
      </Grid2>
    </Modal>
  );
};

export default AudioUploadForm;
