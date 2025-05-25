import Grid2 from "@mui/material/Grid2";
import styles from "./directToLogin.module.css";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const DirectToLogin = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/");
  };
  return (
    <Grid2 className={styles.redirect_text_container}>
      <Typography variant="RedirectText" className={styles.redirect_text}>
        Please check your email and verify it. Once verified, click the button
        below to login
      </Typography>
      <ButtonBase onClick={handleRedirect}>
        <Typography className={styles.signup_button} variant="button">
          Go to Login Page
        </Typography>
      </ButtonBase>
    </Grid2>
  );
};

export default DirectToLogin;
