import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import Grid2 from "@mui/material/Grid2";
import styles from "./createPlaylistTitle.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addPlaylistDetails } from "../../redux/slices/homepage.slice";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { userSelector } from "../../redux/selectors/homepage.selector";

const CreatePlaylistTitle = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector(userSelector);
  const [errorMessage, setErrorMessage] = useState("");

  const images = [
    "/images/PlaylistCoverArt/playlist1.png",
    "/images/PlaylistCoverArt/playlist2.png",
    "/images/PlaylistCoverArt/playlist3.jpeg",
    "/images/PlaylistCoverArt/playlist4.jpeg",
    "/images/PlaylistCoverArt/playlist5.png",
    "/images/PlaylistCoverArt/playlist6.png",
    "/images/PlaylistCoverArt/playlist7.jpeg",
    "/images/PlaylistCoverArt/playlist8.jpeg",
    "/images/PlaylistCoverArt/playlist9.png",
    "/images/PlaylistCoverArt/playlist10.jpeg",
  ];

  const handleInput = (e) => {
    setErrorMessage(false);
    setTitle(e.target.value);
  };

  const handleDone = async () => {
    try {
      if (!title) {
        setErrorMessage("Enter a playlist title");
      } else {
        setLoading(true);
        const randomImage = images[Math.floor(Math.random() * images.length)];

        const uploadPlaylist = {
          playlist_title: title,
          playlist_cover_art: randomImage,
          user_id: user.user_id,
        };
        const response = await axios.post(
          "/api/addPlaylist",
          { uploadPlaylist },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const id = response.data?.playlist_details?.returning?.[0]?.playlist_id;
        uploadPlaylist.id = id;
        dispatch(addPlaylistDetails(uploadPlaylist));
      }
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
        </Grid2>
      </Modal>
      <Backdrop className={styles.loader_backdrop} open={loading}>
        <CircularProgress className={styles.loader_spinner} />
      </Backdrop>
    </>
  );
};

export default CreatePlaylistTitle;
