import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ButtonBase from "@mui/material/ButtonBase";
import Grid2 from "@mui/material/Grid2";
import styles from "./moveSong.module.css";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { playlistsSelector } from "../../redux/selectors/homepage.selector";
import { Radio } from "@mui/material";
import { deleteSong } from "../../redux/slices/homepage.slice";
import exclaimationMark from "../../assets/images/Homepage/ExclaimationMark.png";

const PlaylistSelector = ({ filteredPlaylists, selected, handleSelect }) => {
  return (
    <Grid2 className={styles.playlist_container}>
      {filteredPlaylists.length > 0 ? (
        filteredPlaylists.map(([id, playlist]) => (
          <ButtonBase
            key={id}
            className={`${styles.playlist_item} ${
              selected === id ? styles.selected_item : ""
            }`}
            onClick={() => handleSelect(id)}
          >
            <Radio
              checked={selected === id}
              onChange={() => handleSelect(id)}
            />
            <img
              loading="lazy"
              alt=""
              src={playlist.playlist_cover_art}
              className={styles.playlist_image}
            />
            <Grid2 className={styles.playlist_content}>
              <Typography
                variant="RedirectText"
                className={styles.playlist_title}
              >
                {playlist?.playlist_title}
              </Typography>
            </Grid2>
          </ButtonBase>
        ))
      ) : (
        <Typography>No playlists available</Typography>
      )}
    </Grid2>
  );
};

const EmptyPlaylistSelector = () => {
  return (
    <Grid2 className={styles.empty_container}>
      <img
        loading="lazy"
        className={styles.empty_image}
        src={exclaimationMark}
        alt=""
      />
      <Typography
        variant="RedirectText"
        className={styles.empty_redirect_text_heading}
      >
        No Playlists Available
      </Typography>
    </Grid2>
  );
};

const MoveSong = ({ open, onClose, songId, playlistId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selected, setSelected] = useState(null);

  const playlists = useSelector(playlistsSelector);
  const filteredPlaylists = Object.entries(playlists).filter(
    ([id]) => id !== playlistId
  );
  const handleSelect = (id) => {
    setSelected(id);
    setErrorMessage("");
  };

  const handleMove = async () => {
    if (!selected) {
      setErrorMessage("Select a destination playlist");
    } else {
      try {
        setLoading(true);
        await axios.post(
          "/api/moveSong",
          {
            oldPlaylistId: playlistId,
            newPlaylistId: selected,
            songId: songId,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        dispatch(deleteSong(songId));
      } catch (error) {
        console.error("Error moving song", error);
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
            Select a Playlist
          </Typography>
          {filteredPlaylists.length > 0 ? (
            <PlaylistSelector
              filteredPlaylists={filteredPlaylists}
              selected={selected}
              handleSelect={handleSelect}
            />
          ) : (
            <EmptyPlaylistSelector />
          )}

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
            <ButtonBase onClick={handleMove} disabled={loading}>
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

export default MoveSong;
