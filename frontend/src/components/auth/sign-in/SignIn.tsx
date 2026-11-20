import Backdrop from "@mui/material/Backdrop";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleSignIn from "../../../assets/images/SignUpAndLogin/GoogleSignIn.svg";
import { auth, googleAuthProvider } from "../../../config/firebase";
import { useAppSelector } from "../../../redux/hooks";
import { userSelector } from "../../../redux/selectors/homepageSelectors";
import { postApi } from "../../../services/api";
import MessageModal from "../../helpers/modals/message-modal/MessageModal";
import styles from "./signIn.module.css";
const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userFromDB = useAppSelector(userSelector);
    const [showMessage, setShowMessage] = useState(false);
    const [messageTitle, setMessageTitle] = useState("");
    const [message, setMessage] = useState("");
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!userFromDB || userFromDB.email_id !== email) {
                const response = await postApi("/api/verifyemail", { email_id: email }, {
                    headers: { "Content-Type": "application/json" },
                });
                if (response.data?.users?.length > 0) {
                    try {
                        const userCredential = await signInWithEmailAndPassword(auth, email, password);
                        const user = userCredential.user;
                        if (user.emailVerified) {
                            navigate("/", { replace: true });
                        }
                        else {
                            setMessageTitle("Email not Verfied!");
                            setMessage("Please verify your email and then login");
                            setShowMessage(true);
                        }
                    }
                    catch (err) {
                        if (err instanceof FirebaseError && err.code === "auth/invalid-credential") {
                            setMessageTitle("Incorrect Credentials!");
                            setMessage("Email ID or Password is Invalid");
                        }
                        else {
                            setMessageTitle("Login Failed!");
                            setMessage("Please try again");
                            console.error("Login failed", err);
                        }
                        setShowMessage(true);
                    }
                }
                else {
                    setMessageTitle("User does not exist!");
                    setMessage("Please register first");
                    setShowMessage(true);
                }
            }
        }
        catch (err) {
            setMessageTitle("Login Failed!");
            setMessage("Please try again");
            setShowMessage(true);
            console.error("Login failed", err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithPopup(auth, googleAuthProvider);
            setLoading(true);
            const user = userCredential.user;
            const response = await postApi("/api/verifyemail", { email_id: user.email }, {
                headers: { "Content-Type": "application/json" },
            });
            if (response.data?.users?.length > 0) {
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
                    headers: { "Content-Type": "application/json" },
                });
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
