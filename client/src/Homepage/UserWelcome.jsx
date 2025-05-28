import Typography from "@mui/material/Typography";
import styles from "./userWelcome.module.css";
import useFetchUserDetails from "../hooks/useFetchUserDetails";
import Grid2 from "@mui/material/Grid2";
import Avatar from "@mui/material/Avatar";
import defaultAvatar from "../assets/Homepage/DefaultAvatar.jpeg";
import ButtonBase from "@mui/material/ButtonBase";
import refreshIcon from "../assets/Homepage/Refresh.png";
import { useSelector } from "react-redux";

const UserWelcome = () => {
  useFetchUserDetails();
  const user = useSelector((state) => state.homepage.user);

  const refreshPage = () => {
    localStorage.clear();
    window.location.reload();
  };
  return user ? (
    <Grid2 className={styles.user_welcome_container}>
      <Grid2 className={styles.welcome_text_container}>
        <Avatar src={defaultAvatar} />
        <Typography variant="UserWelcomeText" className={styles.username_text}>
          {user.username}
        </Typography>
      </Grid2>
      <ButtonBase onClick={refreshPage}>
        <img className={styles.refresh_button} src={refreshIcon} alt="" />
      </ButtonBase>
    </Grid2>
  ) : null;
};

export default UserWelcome;
