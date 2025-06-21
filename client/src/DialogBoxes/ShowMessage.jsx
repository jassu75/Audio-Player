import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import styles from "./showMessage.module.css";
import ButtonBase from "@mui/material/ButtonBase";

const ShowMessage = ({ open, onClose, message, messageTitle }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Grid2 container className={styles.modal_box}>
        <Typography
          variant="HomepageTitleText"
          className={styles.edit_title_text}
        >
          {messageTitle}
        </Typography>
        <Typography variant="RedirectText" className={styles.redirect_text}>
          {message}
        </Typography>
        <Grid2 className={styles.action_buttons_container}>
          <ButtonBase onClick={onClose}>
            <Grid2 className={styles.cancel_button}>
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

export default ShowMessage;
