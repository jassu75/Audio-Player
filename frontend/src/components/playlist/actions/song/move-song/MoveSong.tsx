import { Radio } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import exclaimationMark from "../../../../../assets/images/Homepage/ExclaimationMark.png";
import usePlaylistMetadata from "../../../../../pages/playlist/hooks/usePlaylistMetadata";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { playlistCollectionSelector } from "../../../../../redux/selectors/homepageSelectors";
import { deleteViewingSong } from "../../../../../redux/slices/audioPlayerSlice";
import { postApi } from "../../../../../services/api";
import type { MoveSongProps, PlaylistSelectorProps } from "./types/MoveSong.types";
import { getUserPlaylistRailCover } from "../../../../playlist-rail/utils/playlistRail.utils";
import styles from "./moveSong.module.css";
const PlaylistSelector = ({ filteredPlaylists, selected, handleSelect }: PlaylistSelectorProps) => {
    if (!filteredPlaylists || filteredPlaylists.length === 0) {
        return <Typography>No playlists available</Typography>;
    }
    return (<Grid className={styles.playlist_container}>
      {filteredPlaylists.map((playlist) => {
            const playlistCover = getUserPlaylistRailCover(playlist?.playlist_cover_art);
            return (<ButtonBase key={playlist?.playlist_id} className={`${styles.playlist_item} ${selected === playlist?.playlist_id ? styles.selected_item : ""}`} onClick={() => handleSelect(playlist?.playlist_id)}>
            <Radio checked={selected === playlist?.playlist_id} onChange={() => handleSelect(playlist?.playlist_id)}/>

            <img loading="lazy" alt="" src={playlistCover} className={styles.playlist_image}/>

            <Grid className={styles.playlist_content}>
              <Typography variant="RedirectText" className={styles.playlist_title}>
                {playlist?.playlist_title}
              </Typography>
            </Grid>
          </ButtonBase>);
        })}
    </Grid>);
};
const EmptyPlaylistSelector = () => {
    return (<Grid className={styles.empty_container}>
      <img loading="lazy" className={styles.empty_image} src={exclaimationMark} alt=""/>
      <Typography variant="RedirectText" className={styles.empty_redirect_text_heading}>
        No Playlists Available
      </Typography>
    </Grid>);
};
const MoveSong = ({ open, onClose, songId, playlistId }: MoveSongProps) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selected, setSelected] = useState<string | null>(null);
    const { collectionId } = usePlaylistMetadata(playlistId);
    const playlistCollection = useAppSelector(playlistCollectionSelector);
    const collection = playlistCollection?.find((c) => c.id === collectionId);
    const filteredPlaylists = collection?.collection.filter((p) => p.playlist_id !== playlistId) ?? [];
    useEffect(() => {
        if (open) {
            setSelected(null);
            setErrorMessage("");
        }
    }, [open, songId, playlistId]);
    const handleClose = () => {
        if (!loading)
            onClose();
    };
    const handleSelect = (id: string) => {
        setSelected(id);
        setErrorMessage("");
    };
    const handleMove = async () => {
        if (loading)
            return;
        if (!selected || !filteredPlaylists.some((p) => p.playlist_id === selected)) {
            setErrorMessage("Select a destination playlist");
        }
        else {
            try {
                setLoading(true);
                await postApi("/api/moveSong", {
                    oldPlaylistId: playlistId,
                    newPlaylistId: selected,
                    songId: songId,
                }, {
                    headers: { "Content-Type": "application/json" },
                });
                dispatch(deleteViewingSong(songId));
                onClose();
            }
            catch (error) {
                setErrorMessage("Unable to move song. Please try again.");
                console.error("Error moving song", error);
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
            Select a Playlist
          </Typography>
          {filteredPlaylists.length > 0 ? (<PlaylistSelector filteredPlaylists={filteredPlaylists} selected={selected} handleSelect={handleSelect}/>) : (<EmptyPlaylistSelector />)}

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
            <ButtonBase onClick={handleMove} disabled={loading}>
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
export default MoveSong;
