import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import styles from "./searchSkeleton.module.css";
const SearchSkeleton = () => {
  return (
    <Grid className={styles.container}>
      <Grid className={styles.search_container}>
        <Skeleton variant="circular" width={25} height={30} />
        <Skeleton variant="rectangular" width={300} height={30} />
      </Grid>
    </Grid>
  );
};
export default SearchSkeleton;
