import React, { useState } from "react";
import styles from "./signUp.module.css";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import Grid2 from "@mui/material/Grid2";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      await signOut(auth);

      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/redirect");
    } catch (err) {
      console.error("Error during registration:", err.message);
    }
  };

  return (
    <form className={styles.signup_form} onSubmit={handleRegister}>
      <input
        className={styles.signup_input}
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className={styles.signup_input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className={styles.signup_input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Grid2 className={styles.submit_button_container}>
        <ButtonBase type="submit">
          <Typography className={styles.signup_button} variant="button">
            Register
          </Typography>
        </ButtonBase>
      </Grid2>
    </form>
  );
};

export default SignUp;
