import { useState } from "react";
import styles from "./signUp.module.css";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Grid2 from "@mui/material/Grid2";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/verifyemail",
        { email_id: email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data?.users?.length > 0) {
        alert("Email already exists. Please login.");
      } else {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;

          const newUser = {
            id: user.uid,
            email_id: user.email,
            username,
            sign_in_method: "email",
            homepage_songs: [],
            playlist_ids: [],
          };

          await axios.post(
            "/api/addUser",
            { newUser },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          await sendEmailVerification(user);
          await signOut(auth);

          setUsername("");
          setEmail("");
          setPassword("");
          navigate("/redirect");
        } catch (err) {
          if (err.code === "auth/email-already-in-use") {
            alert("Email already exists. Please login.");
          } else if (err.code === "auth/weak-password") {
            alert("Password is too weak. Please use a stronger password.");
          } else if (err.code === "auth/invalid-email") {
            alert("Invalid email format.");
          } else {
            alert("An error occurred during registration. Please try again.");
          }
        }
      }
    } catch (err) {
      alert("An error occurred during registration. Please try again.");

      console.error("Error during registration:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className={styles.signup_form} onSubmit={handleRegister}>
        <input
          className={styles.signup_input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="name"
        />
        <input
          className={styles.signup_input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          className={styles.signup_input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <Grid2 className={styles.submit_button_container}>
          <ButtonBase type="submit" disabled={loading}>
            <Typography className={styles.signup_button} variant="button">
              Register
            </Typography>
          </ButtonBase>
        </Grid2>
      </form>
      <Backdrop className={styles.loader_backdrop} open={loading}>
        <CircularProgress className={styles.loader_spinner} />
      </Backdrop>
    </>
  );
};

export default SignUp;
