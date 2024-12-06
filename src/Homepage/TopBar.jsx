import Grid2 from "@mui/material/Grid2";
import UploadButton from "../CustomButtons/UploadButton";
import styles from "./topBar.module.css";

const TopBar = () => {
  return (
    <Grid2 className={styles.container}>
      <UploadButton />
    </Grid2>
  );
};

export default TopBar;
