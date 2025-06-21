import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleAuthProvider } from "../config/firebase";
import styles from "./signIn.module.css";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Grid2 from "@mui/material/Grid2";
import GoogleSignIn from "../assets/SignUpAndLogin/GoogleSignIn.svg";
import { useSelector } from "react-redux";
import axios from "axios";
import { userSelector } from "../redux/selectors/homepage.selector";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let userFromDB = useSelector(userSelector);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userFromDB || userFromDB.email_id !== email) {
        const response = await axios.post(
          "/api/verifyemail",
          { email_id: email },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.data?.users?.length > 0) {
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;

            if (user.emailVerified) {
              navigate("/homepage", { replace: true });
            } else {
              alert("Please verify your email and then login");
            }
          } catch (err) {
            if (err.code === "auth/invalid-credential") {
              alert("Incorrect Email ID or Password");
            } else {
              console.error("Login failed", err);
            }
          }
        } else {
          alert("User does not exist. Please register first.");
        }
      }
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      setLoading(true);
      const user = userCredential.user;
      const response = await axios.post(
        "/api/verifyemail",
        { email_id: user.email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data?.users?.length > 0) {
        navigate("/homepage", { replace: true });
      } else {
        const newUser = {
          id: user.uid,
          email_id: user.email,
          username: user.displayName || "New User",
          sign_in_method: "google",
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

        navigate("/homepage", { replace: true });
      }
    } catch (err) {
      console.error("Google Sign-In failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className={styles.signin_form} onSubmit={handleLogin}>
        <input
          className={styles.signin_input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          className={styles.signin_input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <ButtonBase
          onClick={handleGoogleSignIn}
          className={styles.signin_buttons_container}
        >
          <img
            src={GoogleSignIn}
            alt="Google Sign-In"
            className={styles.signin_button}
          />
        </ButtonBase>

        <Grid2 className={styles.submit_button_container}>
          <ButtonBase type="submit">
            <Typography className={styles.submit_button} variant="LoginButton">
              Login
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

export default SignIn;
