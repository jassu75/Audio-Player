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
import ShowMessage from "../DialogBoxes/ShowMessage";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let userFromDB = useSelector(userSelector);
  const [showMessage, setShowMessage] = useState(false);
  const [messageTitile, setMessageTitle] = useState(null);
  const [message, setMessage] = useState(null);

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
              setMessageTitle("Email not Verfied!");
              setMessage("Please verify your email and then login");
              setShowMessage(true);
            }
          } catch (err) {
            if (err.code === "auth/invalid-credential") {
              setMessageTitle("Incorrect Credentials!");
              setMessage("Email ID or Password is Invalid");
            } else {
              setMessageTitle("Login Failed!");
              setMessage("Please try again");
              console.error("Login failed", err);
            }
            setShowMessage(true);
          }
        } else {
          setMessageTitle("User does not exist!");
          setMessage("Please register first");
          setShowMessage(true);
        }
      }
    } catch (err) {
      setMessageTitle("Login Failed!");
      setMessage("Please try again");
      setShowMessage(true);
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
          user_id: user.uid,
          email_id: user.email,
          username: user.displayName || "New User",
          sign_in_method: "google",
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
      setMessageTitle("Login Failed!");
      setMessage("Please try again");
      setShowMessage(true);
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
      <ShowMessage
        open={showMessage}
        messageTitle={messageTitile}
        message={message}
        onClose={() => setShowMessage(false)}
      />
    </>
  );
};

export default SignIn;
