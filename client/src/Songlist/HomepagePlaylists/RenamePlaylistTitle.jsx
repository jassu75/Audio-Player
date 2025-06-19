import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import Grid2 from "@mui/material/Grid2";
import styles from "./renamePlaylistTitle.module.css";
import { useDispatch } from "react-redux";
import { renamePlaylist } from "../../redux/slices/homepage.slice";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const RenamePlaylistTitle = ({ open, onClose, playlistId, playlistTitle }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInput = (e) => {
    setErrorMessage(false);
    setTitle(e.target.value);
  };

  const handleRename = async () => {
    if (!title) {
      setErrorMessage("Enter a playlist title");
    } else if (title === playlistTitle) {
      setErrorMessage("Please enter a different playlist title");
    } else {
      try {
        setLoading(true);
        const payload = { playlistId: playlistId, newTitle: title };
        dispatch(renamePlaylist(payload));
        await axios.post("/api/updateplaylisttitle", payload, {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error renaming playlist song", error);
      } finally {
        setLoading(false);
        onClose();
      }
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
            className={styles.input}
            placeholder={playlistTitle}
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
            }}
          />
          <Grid2 className={styles.error_message_container}>
            {errorMessage ? (
              <Typography variant="ErrorText" className={styles.error_text}>
                {errorMessage}
              </Typography>
            ) : null}
          </Grid2>
          <Grid2 className={styles.action_buttons_container}>
            <ButtonBase onClick={onClose} disabled={loading}>
              <Grid2
                className={`${styles.cancel_button} ${
                  loading ? styles.disabled_button : ""
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
            <ButtonBase onClick={handleRename} disabled={loading}>
              <Grid2
                className={`${styles.done_button} ${loading}
 ? styles.disabled_button : ""
                        }`}
              >
                <Typography
                  variant="UploadSongText"
                  className={styles.done_button_text}
                >
                  DONE
                </Typography>
              </Grid2>
            </ButtonBase>
          </Grid2>
        </Grid2>
      </Modal>
      {loading ? (
        <Backdrop className={styles.loader_backdrop} open={loading}>
          <CircularProgress className={styles.loader_spinner} />
        </Backdrop>
      ) : null}
    </>
  );
};

export default RenamePlaylistTitle;
