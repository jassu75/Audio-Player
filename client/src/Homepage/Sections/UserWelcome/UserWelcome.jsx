import styles from "./userWelcome.module.css";
import Grid2 from "@mui/material/Grid2";
import { useSelector } from "react-redux";
import HomepageUploadButton from "../../../CustomButtons/HomepageUploadButton/HomepageUploadButton";
import Profile from "./Profile";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { userSelector } from "../../../redux/selectors/homepage.selector";
const UserWelcome = () => {
  const user = useSelector(userSelector);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate("/search");
  };

  return user ? (
    <>
      <Grid2 className={styles.user_welcome_container}>
        <Profile username={user?.username} />
        <Grid2 className={styles.icon_container}>
          <IconButton onClick={handleSearchClick}>
            <SearchIcon className={styles.search_icon} />
          </IconButton>
          <HomepageUploadButton />
        </Grid2>
      </Grid2>
    </>
  ) : null;
};

export default UserWelcome;
