import type { SelectedUploadFile } from "./types/PlaylistUploadForm.types";
import UploadFile from "@mui/icons-material/UploadFile";
import ButtonBase from "@mui/material/ButtonBase";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import * as musicMetadata from "music-metadata";
import React, { useState } from "react";
import { DEFAULT_SONG_COVER } from "../../../../helpers/song-cover/songCover.utils";
import useCloudinaryAudioUpload from "../../../../../hooks/cloudinary/useCloudinaryAudioUpload";
import useCloudinaryImageUpload from "../../../../../hooks/cloudinary/useCloudinaryImageUpload";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { viewingSongListSelector } from "../../../../../redux/selectors/audioPlayerSelectors";
import { userSelector } from "../../../../../redux/selectors/homepageSelectors";
import { addViewingSong } from "../../../../../redux/slices/audioPlayerSlice";
import { postApi } from "../../../../../services/api";
import type { PlaylistUploadProps } from "./types/PlaylistUploadForm.types";
import type { Song } from "../../../playlist-songs-list/playlist-song/types/song.types";
import styles from "./playlistUploadForm.module.css";
const PlaylistUploadForm = ({
  open,
  onClose,
  playlistId,
}: PlaylistUploadProps) => {
  const dispatch = useAppDispatch();
  const { uploadAudioToCloudinary } = useCloudinaryAudioUpload();
  const { uploadImageToCloudinary } = useCloudinaryImageUpload();
  const [selectedFiles, setSelectedFiles] = useState<SelectedUploadFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, string>>(
    {},
  );
  const [isUploading, setIsUploading] = useState(false);
  const allSongs = useAppSelector(viewingSongListSelector);
  const user = useAppSelector(userSelector);
  const songTitles = Object.values(allSongs ?? {})
    ?.map((song) => song.title)
    ?.filter(Boolean);
  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setUploadProgress({});
    setSelectedFiles(files.map((file) => ({ file, status: "Upload Pending" })));
  };
  const handleUpload = async () => {
    if (isUploading || !selectedFiles.length || !user) return;
    const uploadedTitles = new Set(songTitles);
    setIsUploading(true);
    const progress: Record<string, string> = {};
    for (const fileObj of selectedFiles) {
      const { file } = fileObj;
      if (!file.type.startsWith("audio/")) {
        progress[file.name] = "Invalid file type";
        setUploadProgress({ ...progress });
        continue;
      }
      try {
        progress[file.name] = "Uploading...";
        setUploadProgress({ ...progress });
        const metadata = await musicMetadata.parseBlob(file);
        const songTitle = (
          metadata.common.title || file.name.replace(/\.[^.]+$/, "")
        ).trim();
        if (uploadedTitles.has(songTitle)) {
          progress[file.name] = "Song already exists";
        } else {
          const audioDetails = await uploadAudioToCloudinary(file);
          const image = metadata.common.picture?.[0]?.data ?? null;
          const imageDetails = image
            ? await uploadImageToCloudinary(
                new Blob([Uint8Array.from(image)], { type: "image/jpeg" }),
              )
            : { coverArt: DEFAULT_SONG_COVER, coverArtId: "static" };
          const audioSource = "user";
          const uploadedSong: Omit<Song, "song_id"> = {
            user_id: user.user_id,
            title: songTitle,
            artist: (metadata.common.artist || "").trim(),
            album: (metadata.common.album || "").trim(),
            duration: Math.round(metadata.format.duration || 0),
            genre: metadata.common.genre || [],
            release_year: String(metadata.common.year || "").trim(),
            cover_art: imageDetails.coverArt,
            audio_url: audioDetails.audioUrl,
            cover_art_id: imageDetails.coverArtId,
            audio_url_id: audioDetails.audioUrlId,
            source: audioSource,
          };
          const response = await postApi(
            "/api/addSong",
            { uploadedSong },
            {
              headers: { "Content-Type": "application/json" },
            },
          );
          const song_id = response.data?.audio_details?.returning?.[0]?.song_id;
          if (!song_id) throw new Error("No song ID returned");
          await postApi(
            "/api/addPlaylistSong",
            {
              playlist_id: playlistId,
              song_id: song_id,
            },
            {
              headers: { "Content-Type": "application/json" },
            },
          );
          const songWithId = { ...uploadedSong, song_id };
          dispatch(addViewingSong(songWithId));
          uploadedTitles.add(songTitle);
          progress[file.name] = "Uploaded successfully";
        }
      } catch (error) {
        console.error("Error occurred:", error);
        progress[file.name] = `Error Occurred. Try Again`;
      }
      setUploadProgress({ ...progress });
    }
    setIsUploading(false);
  };
  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (isUploading || reason === "backdropClick") {
          return;
        }
        onClose();
      }}
    >
      <Grid className={styles.modal_box}>
        <Typography variant="RedirectText" className={styles.audio_upload_text}>
          Upload Audio Files
        </Typography>
        <Grid className={styles.upload_container}>
          <UploadFile />
          <input
            type="file"
            accept="audio/*"
            multiple
            disabled={isUploading}
            onChange={handleFileSelection}
            className={styles.file_input}
          />
        </Grid>
        <Grid className={styles.file_list_container}>
          <Grid className={styles.file_list}>
            {selectedFiles.map((fileObj, index) => (
              <Grid key={index} className={styles.file_item}>
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
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid className={styles.action_buttons_container}>
          <ButtonBase onClick={onClose} disabled={isUploading}>
            <Grid
              className={`${styles.cancel_button} ${isUploading ? styles.disabled_button : ""}`}
            >
              <Typography
                className={styles.cancel_button_text}
                variant="UploadSongText"
              >
                CANCEL
              </Typography>
            </Grid>
          </ButtonBase>
          <ButtonBase
            onClick={handleUpload}
            disabled={isUploading || !selectedFiles.length}
          >
            <Grid
              className={`${styles.upload_button} ${isUploading ? styles.disabled_button : ""}`}
            >
              <Typography
                variant="UploadSongText"
                className={styles.upload_button_text}
              >
                UPLOAD
              </Typography>
            </Grid>
          </ButtonBase>
        </Grid>
      </Grid>
    </Modal>
  );
};
export default PlaylistUploadForm;
