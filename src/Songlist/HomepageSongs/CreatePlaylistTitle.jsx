import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import Grid2 from "@mui/material/Grid2";
import styles from "./createPlaylistTitle.module.css"
import { useSelector } from "react-redux";

const CreatePlaylistTitle = ({ open, onClose }) => {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.homepage.user);
    const songsList = user.homepage_songs;
    const [errorMessage, setErrorMessage] = useState("");

    const handleDone = () => {
        setLoading(true);




    };

    return (
        <Modal open={true} onClose={onClose}>

            <Grid2 className={styles.modal_box}>
                <Typography variant="RedirectText" className={styles.edit_title_text}>
                    New Playlist Title
                </Typography>
                <TextField
                    label="Playlist Title"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
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
                            color: "white",
                        },
                    }} />
                <Grid2 className={styles.error_message_container}>
                    {errorMessage ?
                        <Typography variant="ErrorText" className={styles.error_text}>{errorMessage}</Typography> : null
                    }
                </Grid2>
                <Grid2 className={styles.action_buttons_container}>
                    <ButtonBase onClick={onClose} disabled={loading}>
                        <Grid2
                            className={`${styles.cancel_button} ${loading ? styles.disabled_button : ""
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
                    <ButtonBase onClick={handleDone} disabled={loading}>
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
            </Grid2 >
        </Modal >
    );
};

export default CreatePlaylistTitle;
