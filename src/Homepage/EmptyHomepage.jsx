import Grid2 from "@mui/material/Grid2";
import emptyImage from "../assets/Homepage/NothingHereYet.jpeg"
import styles from "./emptyHomepage.module.css"

const EmptyHomePage = () => {
    return (
        <Grid2 className={styles.container}>
            <img className={styles.image} src={emptyImage} alt="" />
        </Grid2>
    );
}

export default EmptyHomePage;