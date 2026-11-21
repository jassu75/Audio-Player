import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import forYou from "../../assets/json/forYou.json";
import styles from "./forYouRail.module.css";

const ForYouRail = () => (
    <section className={styles.container} aria-labelledby="for-you-title">
        <Typography id="for-you-title" component="h2" variant="HomepageTitleText" className={styles.title}>For You</Typography>
        <div className={styles.cards}>
            {forYou.data.map(playlist => (
                <Link key={playlist.id} to={playlist.path} className={styles.card}>
                    <img src={playlist.cover_art} alt="" className={styles.image} />
                    <Typography component="span" variant="homepageSongTitle" className={styles.label}>{playlist.title}</Typography>
                </Link>
            ))}
        </div>
    </section>
);

export default ForYouRail;
