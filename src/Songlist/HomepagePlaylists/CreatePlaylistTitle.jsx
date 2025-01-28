import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import Grid2 from "@mui/material/Grid2";
import styles from "./createPlaylistTitle.module.css"
import { useDispatch, useSelector } from "react-redux";
import { ADD_PLAYLIST, UPDATE_PLAYLIST_IDS } from "../../mutations";
import { useMutation } from "@apollo/client";
import defaultPlaylistArt from "../../assets/Homepage/PlaylistCover.png"
import { addPlaylistDetails, addPlaylistIds } from "../HomepageSongs/homepage.slice";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const CreatePlaylistTitle = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.homepage.user);
    const [errorMessage, setErrorMessage] = useState("");
    const [addPlaylistSong] = useMutation(ADD_PLAYLIST);
    const [updatePlaylistIds] = useMutation(UPDATE_PLAYLIST_IDS);

    const handleDone = async () => {
        if (!title) {
            setErrorMessage("Enter a playlist title");
        }
        else {

            setLoading(true);
            const homepagePlaylists = Array.from(user.playlist_ids);
            const uploadPlaylist = {
                playlist_title: title,
                playlist_cover_art: defaultPlaylistArt,
                playlist_songs: []
            }
            const result = await addPlaylistSong({ variables: uploadPlaylist });
            const id = result?.data?.insert_playlist_details?.returning?.[0]?.id;
            uploadPlaylist.id = id;
            homepagePlaylists.push(id);
            dispatch(addPlaylistIds(id));
            dispatch(addPlaylistDetails(uploadPlaylist))
            await updatePlaylistIds({
                variables: {
                    user_id: user.id,
                    playlist_ids: homepagePlaylists,
                },
            });

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
            {loading ?
                <Backdrop className={styles.loader_backdrop} open={loading}>
                    <CircularProgress className={styles.loader_spinner} />
                </Backdrop> : null
            }
        </>
    );
};

export default CreatePlaylistTitle;
