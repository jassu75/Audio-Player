import Skeleton from "@mui/material/Skeleton";
import Grid2 from "@mui/material/Grid2";
import styles from "./searchSkeleton.module.css";

const SearchSkeleton = () => {
  return (
    <Grid2 className={styles.container}>
      <Grid2 className={styles.search_container}>
        <Skeleton variant="circular" width={25} height={30} />
        <Skeleton variant="rect" width={300} height={30} />
      </Grid2>
    </Grid2>
  );
};

export default SearchSkeleton;
