import Backdrop from "@mui/material/Backdrop";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import type { RenameTitleDialogProps } from "./types/RenameTitleDialog.types";
import styles from "./renameTitleDialog.module.css";
const RenameTitleDialog = ({ open, onClose, itemId, currentTitle, itemType, onRename }: RenameTitleDialogProps) => {
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
        if (!loading)
            onClose();
    };
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMessage("");
        setTitle(e.target.value);
    };
    const handleRename = async () => {
        if (loading)
            return;
        const newTitle = title.trim();
        if (!newTitle) {
            setErrorMessage("Enter a " + itemType + " title");
        }
        else if (newTitle === currentTitle) {
            setErrorMessage("Please enter a different " + itemType + " title");
        }
        else {
            try {
                setLoading(true);
                setErrorMessage("");
                await onRename(newTitle);
                setTitle("");
                onClose();
            }
            catch (error) {
                setErrorMessage("Unable to rename " + itemType + ". Please try again.");
                console.error("Error renaming " + itemType, error);
            }
            finally {
                setLoading(false);
            }
        }
    };
    return (<>
      <Modal open={open} onClose={handleClose}>
        <Grid className={styles.modal_box}>
          <Typography variant="RedirectText" className={styles.edit_title_text}>
            New {label} Title
          </Typography>
          <TextField label={label + " Title"} variant="outlined" value={title} onChange={handleInput} fullWidth className={styles.input} placeholder={currentTitle} slotProps={{
            htmlInput: {
                maxLength: 32,
            },
        }} sx={{
            "& .MuiInputBase-input": {
                color: "white",
            },
            "& .MuiInputLabel-root": {
                color: "white",
            },
            "& .MuiInputLabel-root.Mui-focused": {
                color: "yellow",
            },
        }}/>
          <Grid className={styles.error_message_container}>
            {errorMessage ? (<Typography variant="ErrorText" className={styles.error_text}>
                {errorMessage}
              </Typography>) : null}
          </Grid>
          <Grid className={styles.action_buttons_container}>
            <ButtonBase onClick={handleClose} disabled={loading}>
              <Grid className={`${styles.cancel_button} ${loading ? styles.disabled_button : ""}`}>
                <Typography className={styles.cancel_button_text} variant="UploadSongText">
                  CANCEL
                </Typography>
              </Grid>
            </ButtonBase>
            <ButtonBase onClick={handleRename} disabled={loading}>
              <Grid className={`${styles.done_button} ${loading ? styles.disabled_button : ""}`}>
                <Typography variant="UploadSongText" className={styles.done_button_text}>
                  DONE
                </Typography>
              </Grid>
            </ButtonBase>
          </Grid>
        </Grid>
      </Modal>
      <Backdrop className={styles.loader_backdrop} open={loading}>
        <CircularProgress className={styles.loader_spinner}/>
      </Backdrop>
    </>);
};
export default RenameTitleDialog;
