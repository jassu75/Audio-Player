import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import styles from "./emptySearch.module.css";
const EmptySearch = () => {
  return (
    <Grid className={styles.container}>
      <Grid className={styles.empty_search_container}>
        <Typography
          variant="homepageSongTitle"
          className={styles.empty_search_text}
        >
          No Results Available
        </Typography>
      </Grid>
    </Grid>
  );
};
export default EmptySearch;
