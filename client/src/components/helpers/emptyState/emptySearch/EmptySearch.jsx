import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Grid2";
import styles from "./emptySearch.module.css";
const EmptySearch = () => {
  return (
    <Grid2 className={styles.container}>
      <Grid2 className={styles.empty_search_container}>
        <Typography
          variant="homepageSongTitle"
          className={styles.empty_search_text}
        >
          No Results Available
        </Typography>
      </Grid2>
    </Grid2>
  );
};

export default EmptySearch;
