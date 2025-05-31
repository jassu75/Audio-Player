import Grid2 from "@mui/material/Grid2";
import styles from "../SignUpAndLogin/directToLogin.module.css";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const ErrorPage = () => {
  const [loading, setLoading] = useState(false);
  const handleError = () => {
    setLoading(true);
    window.location.reload();
  };
  return (
    <Grid2 className={styles.redirect_text_container}>
      <Typography variant="RedirectText" className={styles.redirect_text}>
        Error occured while loading the page. Please check your internet
        connection and try again
      </Typography>
      <ButtonBase onClick={handleError}>
        {loading ? (
          <>
            <Typography className={styles.signup_button} variant="button">
              Retrying
            </Typography>
            <CircularProgress className={styles.loader} size={20} />
          </>
        ) : (
          <Typography className={styles.signup_button} variant="button">
            Retry
          </Typography>
        )}
      </ButtonBase>
    </Grid2>
  );
};

export default ErrorPage;
