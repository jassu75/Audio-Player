import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";

import styles from "./homepageSongSection.module.css";
import { useState } from "react";
import JamendoSongList from "../JamendoSongSection.jsx/JamendoSongList";

const HomepageSongSection = () => {
  const [view, setView] = useState("jamendoSongSection");

  return (
    <Grid2 className={styles.container}>
      <nav className={styles.navbar}>
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
      <JamendoSongList />
    </Grid2>
  );
};

export default HomepageSongSection;
