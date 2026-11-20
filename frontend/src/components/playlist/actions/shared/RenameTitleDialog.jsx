import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import Grid2 from "@mui/material/Grid2";
import styles from "./renameTitleDialog.module.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const RenameTitleDialog = ({ open, onClose, itemId, currentTitle, itemType, onRename }) => {
  const label = itemType === "playlist" ? "Playlist" : "Song";
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setErrorMessage("");
    }
  }, [open, itemId]);

  const handleClose = () => {
    if (!loading) onClose();
  };

  const handleInput = (e) => {
    setErrorMessage("");
    setTitle(e.target.value);
  };

  const handleRename = async () => {
    if (loading) return;
    const newTitle = title.trim();
    if (!newTitle) {
      setErrorMessage("Enter a " + itemType + " title");
    } else if (newTitle === currentTitle) {
      setErrorMessage("Please enter a different " + itemType + " title");
    } else {
      try {
        setLoading(true);
        setErrorMessage("");
        await onRename(newTitle);
        setTitle("");
        onClose();
      } catch (error) {
        setErrorMessage("Unable to rename " + itemType + ". Please try again.");
        console.error("Error renaming " + itemType, error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Grid2 className={styles.modal_box}>
          <Typography variant="RedirectText" className={styles.edit_title_text}>
            New {label} Title
          </Typography>
          <TextField
            label={label + " Title"}
            variant="outlined"
            value={title}
            onChange={handleInput}
            fullWidth
            className={styles.input}
            placeholder={currentTitle}
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
            <ButtonBase onClick={handleClose} disabled={loading}>
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
                className={`${styles.done_button} ${loading ? styles.disabled_button : ""}`}
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
      <Backdrop className={styles.loader_backdrop} open={loading}>
        <CircularProgress className={styles.loader_spinner} />
      </Backdrop>
    </>
  );
};

export default RenameTitleDialog;
