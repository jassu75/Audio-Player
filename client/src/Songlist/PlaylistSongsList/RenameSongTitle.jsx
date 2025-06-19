import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import Grid2 from "@mui/material/Grid2";
import styles from "./renameSongTitle.module.css";
import { useDispatch } from "react-redux";
import { renameSong } from "../../redux/slices/homepage.slice";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const RenameSongTitle = ({ open, onClose, songId, songTitle }) => {
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
      setErrorMessage("Enter a song title");
    } else if (title === songTitle) {
      setErrorMessage("Please enter a different song title");
    } else {
      try {
        setLoading(true);
        const payload = { songId: songId, newTitle: title };
        dispatch(renameSong(payload));
        await axios.post("/api/updatesongtitle", payload, {
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
            New Song Title
          </Typography>
          <TextField
            label="Song Title"
            variant="outlined"
            value={title}
            onChange={handleInput}
            fullWidth
            className={styles.input}
            placeholder={songTitle}
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

export default RenameSongTitle;
