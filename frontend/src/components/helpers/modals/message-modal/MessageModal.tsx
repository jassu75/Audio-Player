import ButtonBase from "@mui/material/ButtonBase";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import type { MessageModalProps } from "./types/MessageModal.types";
import styles from "./messageModal.module.css";
const MessageModal = ({
  open,
  onClose,
  message,
  messageTitle,
}: MessageModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Grid container className={styles.modal_box}>
        <Grid className={styles.title}>
          <Typography
            variant="HomepageTitleText"
            className={styles.edit_title_text}
          >
            {messageTitle}
          </Typography>
        </Grid>
        <Grid className={styles.message}>
          <Typography variant="RedirectText" className={styles.redirect_text}>
            {message}
          </Typography>
        </Grid>

        <Grid className={styles.action_buttons_container}>
          <ButtonBase onClick={onClose}>
            <Grid className={styles.cancel_button}>
              <Typography
                className={styles.cancel_button_text}
                variant="UploadSongText"
              >
                OK
              </Typography>
            </Grid>
          </ButtonBase>
        </Grid>
      </Grid>
    </Modal>
  );
};
export default MessageModal;
