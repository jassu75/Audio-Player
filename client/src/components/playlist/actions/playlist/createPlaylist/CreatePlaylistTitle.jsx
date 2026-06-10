import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import Grid2 from "@mui/material/Grid2";
import styles from "./createPlaylistTitle.module.css";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { userSelector } from "../../../../../redux/selectors/homepage.selector";
import { addPlaylist } from "../../../../../redux/slices/homepage.slice";
import { PLAYLIST_COVER_IMAGES } from "../../../../../assets/assets.consts";

const CreatePlaylistTitle = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector(userSelector);
  const [errorMessage, setErrorMessage] = useState("");
  const doneDisabled = loading || !title;

  const handleInput = (e) => {
    setErrorMessage(false);
    setTitle(e.target.value);
  };

  const handleDone = async () => {
    try {
      setLoading(true);
      const randomImageKey = Object.keys(PLAYLIST_COVER_IMAGES)[
        Math.floor(Math.random() * Object.keys(PLAYLIST_COVER_IMAGES).length)
      ];

      const uploadPlaylist = {
        playlist_title: title,
        playlist_cover_art: randomImageKey,
        user_id: user.user_id,
        source: "user",
      };
      const response = await axios.post("/api/addPlaylist", { uploadPlaylist });
      const playlistId =
        response.data?.playlist_details?.returning?.[0]?.playlist_id;

      const newPlaylist = {
        playlist_id: playlistId,
        playlist_title: title,
        playlist_cover_art: randomImageKey,
      };

      dispatch(addPlaylist(newPlaylist));
    } catch (error) {
      console.error("Error creating playlist", error);
    } finally {
      setTitle("");
      setLoading(false);
      onClose();
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Grid2 className={styles.modal_box}>
          <Typography variant="RedirectText" className={styles.edit_title_text}>
            New Playlist Title
          </Typography>
          <TextField
            label="Playlist Title"
            variant="outlined"
            value={title}
            onChange={handleInput}
            fullWidth
            error={!!errorMessage}
            helperText={errorMessage || " "}
            className={styles.input}
            slotProps={{
              htmlInput: {
                maxLength: 32,
              },
            }}
            sx={{
              "& .MuiInputBase-input": {
                color: "white",
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "yellow",
              },
              "& .MuiFormHelperText-root": {
                color: "#ff7f7f",
              },
            }}
          />

          <Grid2 className={styles.action_buttons_container}>
            <ButtonBase
              onClick={onClose}
              disabled={loading}
              className={styles.cancel_button}
            >
              <Typography
                className={styles.cancel_button_text}
                variant="UploadSongText"
              >
                CANCEL
              </Typography>
            </ButtonBase>
            <ButtonBase
              onClick={handleDone}
              disabled={doneDisabled}
              className={styles.done_button}
            >
              <Typography
                variant="UploadSongText"
                className={styles.done_button_text}
              >
                DONE
              </Typography>
            </ButtonBase>
          </Grid2>
        </Grid2>
      </Modal>
      <Backdrop className={styles.loader_backdrop} open={loading}>
        <CircularProgress className={styles.loader_spinner} />
      </Backdrop>
    </>
  );
};

export default CreatePlaylistTitle;
