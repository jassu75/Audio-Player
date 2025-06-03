import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";

import styles from "./homepageSongSection.module.css";
import { useState } from "react";
import UserSongSection from "../UserSongSection/UserSongSection";
import JamendoSongList from "../JamendoSongSection.jsx/JamendoSongList";

const HomepageSongSection = () => {
  const [view, setView] = useState("userSongSection");

  return (
    <Grid2 className={styles.container}>
      <nav className={styles.navbar}>
        <ButtonBase onClick={() => setView("userSongSection")}>
          <Typography
            className={`${styles.nav_button} ${
              view === "userSongSection" ? styles.active : ""
            }`}
            variant="SignInAndSignUpButton"
          >
            Your Songs
          </Typography>
        </ButtonBase>
        <ButtonBase onClick={() => setView("jamendoSongSection")}>
          <Typography
            className={`${styles.nav_button} ${
              view === "jamendoSongSection" ? styles.active : ""
            }`}
            variant="SignInAndSignUpButton"
          >
            Popular Songs
          </Typography>
        </ButtonBase>
      </nav>
      {view === "userSongSection" ? <UserSongSection /> : <JamendoSongList />}
    </Grid2>
  );
};

export default HomepageSongSection;
