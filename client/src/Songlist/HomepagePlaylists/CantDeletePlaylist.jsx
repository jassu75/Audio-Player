import Grid2 from "@mui/material/Grid2"
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import styles from "./cantDeletePlaylist.module.css"
import ButtonBase from "@mui/material/ButtonBase";


const CantDeletePlaylist = ({ open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Grid2 container className={styles.modal_box}>
                <Typography variant="h6" className={styles.edit_title_text}>
                    Cant delete Playlist!!
                </Typography>
                <Typography variant="RedirectText" className={styles.redirect_text}>
                    Please delete the songs in the playlist before proceeding.                </Typography>
                <Grid2 className={styles.action_buttons_container}>
                    <ButtonBase onClick={onClose}>
                        <Grid2
                            className={styles.cancel_button}
                        >
                            <Typography
                                className={styles.cancel_button_text}
                                variant="UploadSongText"
                            >
                                OK
                            </Typography>
                        </Grid2>
                    </ButtonBase>
                </Grid2>
            </Grid2>
        </Modal>
    );
};

export default CantDeletePlaylist;