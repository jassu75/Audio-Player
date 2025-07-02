import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import forYouList from "../../../assets/json/forYou.json";
import styles from "./homepageForYouSection.module.css";
import HomepageForYouItem from "./HomepageForYouItem";

const HomepageForYouSection = () => {
  return (
    <Grid2 className={styles.homepage_playlists}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          For You
        </Typography>
      </Grid2>
      <Grid2 className={styles.playlist_list}>
        {forYouList.data.map((forYouItem) => (
          <HomepageForYouItem
            key={forYouItem.foryou_id}
            forYouKey={forYouItem.foryou_id}
            forYouItem={forYouItem}
          />
        ))}
      </Grid2>
    </Grid2>
  );
};

export default HomepageForYouSection;
