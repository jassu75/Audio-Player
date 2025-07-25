import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import UploadFile from "@mui/icons-material/UploadFile";
import * as musicMetadata from "music-metadata-browser";
import useCloudinaryAudioUpload from "./useCloudinaryAudioUpload";
import useCloudinaryImageUpload from "./useCloudinaryImageUpload";
import { addSongs } from "../redux/slices/homepage.slice";
import styles from "./playlistUploadForm.module.css";
import Grid2 from "@mui/material/Grid2";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import defaultMusicNote from "../assets/images/AudioUploadForm/defaultMusicImage.webp";
import axios from "axios";
import {
  songsSelector,
  userSelector,
} from "../redux/selectors/homepage.selector";

const PlaylistUploadForm = ({ open, onClose, playlistId }) => {
  const dispatch = useDispatch();
  const { uploadAudioToCloudinary } = useCloudinaryAudioUpload();
  const { uploadImageToCloudinary } = useCloudinaryImageUpload();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [newSong, setNewSong] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const allSongs = useSelector(songsSelector);
  const user = useSelector(userSelector);

  const songTitles = Object.values(allSongs ?? {})
    ?.map((song) => song.title)
    ?.filter(Boolean);

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files.map((file) => ({ file, status: "Upload Pending" })));
  };

  const handleUpload = async () => {
    setIsUploading(true);
    const progress = {};
    for (const fileObj of selectedFiles) {
      const { file } = fileObj;

      if (!file.type.startsWith("audio/")) {
        progress[file.name] = "Invalid file type";
        continue;
      }

      try {
        progress[file.name] = "Uploading...";
        setUploadProgress({ ...progress });
        const metadata = await musicMetadata.parseBlob(file);
        const songTitle =
          metadata.common.title || file.name.replace(".mp3", "").trim();
        if (songTitles.includes(songTitle)) {
          progress[file.name] = "Song already exists";
        } else {
          const audioDetails = await uploadAudioToCloudinary(file);

          const image = metadata.common.picture
            ? metadata.common.picture[0].data
            : null;

          const imageDetails = image
            ? await uploadImageToCloudinary(
                new Blob([image], { type: "image/jpeg" })
              )
            : { coverArt: defaultMusicNote, coverArtId: "static" };

          const uploadedSong = {
            user_id: user.user_id,
            title: (
              metadata.common.title || file.name.replace(".mp3", "")
            ).trim(),
            artist: (metadata.common.artist || "").trim(),
            album: (metadata.common.album || "").trim(),
            duration: Math.round(metadata.format.duration || 0),
            genre: metadata.common.genre || [],
            release_year: String(metadata.common.year || "").trim(),
            cover_art: imageDetails.coverArt,
            audio_url: audioDetails.audioUrl,
            cover_art_id: imageDetails.coverArtId,
            audio_url_id: audioDetails.audioUrlId,
          };

          const response = await axios.post(
            "/api/addSong",
            { uploadedSong },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const song_id = response.data?.audio_details?.returning?.[0]?.song_id;

          await axios.post(
            "/api/addPlaylistSong",
            {
              playlist_id: playlistId,
              song_id: song_id,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          const songWithId = { ...uploadedSong, song_id };
          setNewSong(songWithId);
          progress[file.name] = "Uploaded successfully";
        }
      } catch (error) {
        console.error("Error occurred:", error);

        progress[file.name] = `Error Occurred. Try Again`;
      }

      setUploadProgress({ ...progress });
    }
    setIsUploading(false);
    setTimeout(() => {
      setSelectedFiles([]);
    }, 1500);
  };

  useEffect(() => {
    if (newSong) {
      dispatch(addSongs(newSong));
    }
  }, [newSong, dispatch]);

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
          return;
        }
        onClose();
      }}
    >
      <Grid2 className={styles.modal_box}>
        <Typography variant="RedirectText" className={styles.audio_upload_text}>
          Upload Audio Files
        </Typography>
        <Grid2 className={styles.upload_container}>
          <UploadFile />
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileSelection}
            className={styles.file_input}
          />
        </Grid2>
        <Grid2 className={styles.file_list_container}>
          <Grid2 className={styles.file_list}>
            {selectedFiles.map((fileObj, index) => (
              <Grid2 key={index} className={styles.file_item}>
                <Typography
                  variant="UploadFileText"
                  className={styles.file_name}
                >
                  {fileObj.file.name}
                </Typography>
                <Typography
                  variant="UploadFileStatusText"
                  className={styles.file_upload_status_text}
                >
                  {uploadProgress[fileObj.file.name] || "Upload Pending"}
                </Typography>
              </Grid2>
            ))}
          </Grid2>
        </Grid2>
        <Grid2 className={styles.action_buttons_container}>
          <ButtonBase onClick={onClose} disabled={isUploading}>
            <Grid2
              className={`${styles.cancel_button} ${
                isUploading ? styles.disabled_button : ""
              }`}
            >
              <Typography
                className={styles.cancel_button_text}
                variant="UploadSongText"
              >
                CANCEL
              </Typography>
            </Grid2>
          </ButtonBase>
          <ButtonBase onClick={handleUpload} disabled={isUploading}>
            <Grid2
              className={`${styles.upload_button} ${
                isUploading ? styles.disabled_button : ""
              }`}
            >
              <Typography
                variant="UploadSongText"
                className={styles.upload_button_text}
              >
                UPLOAD
              </Typography>
            </Grid2>
          </ButtonBase>
        </Grid2>
      </Grid2>
    </Modal>
  );
};

export default PlaylistUploadForm;
