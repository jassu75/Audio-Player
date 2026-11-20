import ButtonBase from "@mui/material/ButtonBase";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import authenticationMan from "../../assets/images/SignUpAndLogin/AuthenticationMan.svg";
import musicNote from "../../assets/images/SignUpAndLogin/musicNote.jpg";
import SignIn from "../../components/auth/sign-in/SignIn";
import SignUp from "../../components/auth/sign-up/SignUp";
import styles from "./auth.module.css";
const Auth = () => {
    const [view, setView] = useState("signIn");
    return (<Grid className={styles.container}>
      <Grid className={styles.left_pane}>
        <Grid className={styles.left_side_text}>
          <Typography variant="ManFallingText" className={styles.man_falling_text}>
            ADD YOUR FAVORITE MUSIC AND PODCASTS TO LISTEN FOR FREE
          </Typography>
        </Grid>
        <img loading="lazy" src={authenticationMan} className={styles.authentication_man_logo} alt=""/>
      </Grid>

      <Grid className={styles.signin_card}>
        <img loading="lazy" src={musicNote} className={styles.authentication_logo} alt=""/>

        <nav className={styles.navbar}>
          <ButtonBase onClick={() => setView("signIn")}>
            <Typography className={`${styles.nav_button} ${view === "signIn" ? styles.active : ""}`} variant="SignInAndSignUpButton">
              LOGIN
            </Typography>
          </ButtonBase>
          <ButtonBase onClick={() => setView("signUp")}>
            <Typography className={`${styles.nav_button} ${view === "signUp" ? styles.active : ""}`} variant="SignInAndSignUpButton">
              SIGNUP
            </Typography>
          </ButtonBase>
        </nav>
        {view === "signIn" ? <SignIn /> : <SignUp />}
      </Grid>
    </Grid>);
};
export default Auth;
