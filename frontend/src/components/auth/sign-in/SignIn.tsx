import Backdrop from "@mui/material/Backdrop";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleSignIn from "../../../assets/images/SignUpAndLogin/GoogleSignIn.svg";
import { auth, authReady, googleAuthProvider } from "../../../config/firebase";
import { postApi } from "../../../services/api";
import { createUserSession } from "../../../services/session";
import MessageModal from "../../helpers/modals/message-modal/MessageModal";
import styles from "./signIn.module.css";
const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);
    const [messageTitle, setMessageTitle] = useState("");
    const [message, setMessage] = useState("");
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authReady;
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            if (!user.emailVerified) {
                await signOut(auth);
                setMessageTitle("Email not verified");
                setMessage("Please verify your email and then log in.");
                setShowMessage(true);
                return;
            }
            await createUserSession(user);
            navigate("/", { replace: true });
        } catch (error) {
            setMessageTitle("Login failed");
            setMessage(error instanceof FirebaseError && error.code === "auth/invalid-credential"
                ? "Email or password is invalid."
                : "Unable to sign in. Please try again.");
            setShowMessage(true);
        } finally {
            setLoading(false);
        }
    };
    const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            await authReady;
            const userCredential = await signInWithPopup(auth, googleAuthProvider);
            setLoading(true);
            const user = userCredential.user;
            const response = await postApi("/api/verifyemail", { email_id: user.email }, {
                headers: { "Content-Type": "application/json" },
            });
            if (response.data?.users?.length > 0) {
                await createUserSession(user);
                navigate("/", { replace: true });
            }
            else {
                const newUser = {
                    user_id: user.uid,
                    email_id: user.email,
                    username: user.displayName || "New User",
                    sign_in_method: "google",
                };
                await postApi("/api/addUser", { newUser }, {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${await user.getIdToken()}` },
                });
                await createUserSession(user);
                navigate("/", { replace: true });
            }
        }
        catch (err) {
            setMessageTitle("Login Failed!");
            setMessage("Please try again");
            setShowMessage(true);
            console.error("Google Sign-In failed", err);
        }
        finally {
            setLoading(false);
        }
    };
    return (<>
      <form className={styles.signin_form} onSubmit={handleLogin}>
        <input className={styles.signin_input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"/>
        <input className={styles.signin_input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"/>

        <ButtonBase onClick={handleGoogleSignIn} className={styles.signin_buttons_container}>
          <img loading="lazy" src={GoogleSignIn} alt="Google Sign-In" className={styles.signin_button}/>
        </ButtonBase>

        <Grid className={styles.submit_button_container}>
          <ButtonBase type="submit">
            <Typography className={styles.submit_button} variant="SignInAndSignUpButton">
              Login
            </Typography>
          </ButtonBase>
        </Grid>
      </form>

      <Backdrop className={styles.loader_backdrop} open={loading}>
        <CircularProgress className={styles.loader_spinner}/>
      </Backdrop>
      <MessageModal open={showMessage} messageTitle={messageTitle} message={message} onClose={() => setShowMessage(false)}/>
    </>);
};
export default SignIn;
