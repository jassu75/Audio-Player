import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleAuthProvider } from "../config/firebase";
import styles from "./signIn.module.css";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import Grid2 from "@mui/material/Grid2";
import GoogleSignIn from "../assets/SignUpAndLogin/GoogleSignIn.svg";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user.emailVerified) navigate("/homepage");
      else alert("Please verify your email and then login");
    } catch (err) {}
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();

    try {
      await signInWithPopup(auth, googleAuthProvider);
      navigate("/homepage");
    } catch (err) {
      console.error("signin failed");
    }
  };

  return (
    <form className={styles.signin_form} onSubmit={handleLogin}>
      <input
        className={styles.signin_input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className={styles.signin_input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <ButtonBase
        onClick={handleGoogleSignIn}
        className={styles.signin_buttons_container}
      >
        <img src={GoogleSignIn} alt="" className={styles.signin_button} />
      </ButtonBase>

      <Grid2 className={styles.submit_button_container}>
        <ButtonBase type="submit">
          <Typography className={styles.submit_button} variant="LoginButton">
            Login
          </Typography>
        </ButtonBase>
      </Grid2>
    </form>
  );
};

export default SignIn;
