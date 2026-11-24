import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { userSelector } from "../../redux/selectors/homepageSelectors";
import CreatePlaylistButton from "./create-playlist-button/CreatePlaylistButton";
import styles from "./navbar.module.css";
import Profile from "./profile/Profile";
const Navbar = () => {
  const user = useAppSelector(userSelector);
  const navigate = useNavigate();
  const handleSearchClick = () => {
    navigate("/search");
  };
  return user ? (
    <>
      <Grid className={styles.user_welcome_container}>
        <Profile username={user?.username} />
        <Grid className={styles.icon_container}>
          <IconButton onClick={handleSearchClick}>
            <SearchIcon className={styles.search_icon} />
          </IconButton>
          <CreatePlaylistButton />
        </Grid>
      </Grid>
    </>
  ) : null;
};
export default Navbar;
