import React, { useState } from "react";
import styles from "./userAuthentication.module.css";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import musicNote from "../assets/images/SignUpAndLogin/musicNote.jpg";
import authenticationMan from "../assets/images/SignUpAndLogin/AuthenticationMan.svg";
import ButtonBase from "@mui/material/ButtonBase";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

const UserAuthentication = () => {
  const [view, setView] = useState("signIn");

  return (
    <Grid2 className={styles.container}>
      <Grid2 className={styles.left_pane}>
        <Grid2 className={styles.left_side_text}>
          <Typography
            variant="ManFallingText"
            className={styles.man_falling_text}
          >
            ADD YOUR FAVORITE MUSIC AND PODCASTS TO LISTEN FOR FREE
          </Typography>
        </Grid2>
        <img
          loading="lazy"
          src={authenticationMan}
          className={styles.authentication_man_logo}
          alt=""
        />
      </Grid2>

      <Grid2 className={styles.signin_card}>
        <img
          loading="lazy"
          src={musicNote}
          className={styles.authentication_logo}
          alt=""
        />

        <nav className={styles.navbar}>
          <ButtonBase onClick={() => setView("signIn")}>
            <Typography
              className={`${styles.nav_button} ${
                view === "signIn" ? styles.active : ""
              }`}
              variant="SignInAndSignUpButton"
            >
              LOGIN
            </Typography>
          </ButtonBase>
          <ButtonBase onClick={() => setView("signUp")}>
            <Typography
              className={`${styles.nav_button} ${
                view === "signUp" ? styles.active : ""
              }`}
              variant="SignInAndSignUpButton"
            >
              SIGNUP
            </Typography>
          </ButtonBase>
        </nav>
        {view === "signIn" ? <SignIn /> : <SignUp />}
      </Grid2>
    </Grid2>
  );
};

export default UserAuthentication;
