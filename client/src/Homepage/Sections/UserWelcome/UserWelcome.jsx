import styles from "./userWelcome.module.css";
import useFetchUserDetails from "../../../hooks/useFetchUserDetails";
import Grid2 from "@mui/material/Grid2";
import { useSelector } from "react-redux";
import HomepageUploadButton from "../../../CustomButtons/HomepageUploadButton/HomepageUploadButton";
import Profile from "./Profile";

const UserWelcome = () => {
  useFetchUserDetails();
  const user = useSelector((state) => state.homepage.user);

  return user ? (
    <>
      <Grid2 className={styles.user_welcome_container}>
        <Profile username={user?.username} />
        <HomepageUploadButton />
      </Grid2>
    </>
  ) : null;
};

export default UserWelcome;
