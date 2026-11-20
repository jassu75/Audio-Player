import { Grid, Skeleton } from "@mui/material";
import styles from "./favoriteSkeleton.module.css";
const FavoriteSkeleton = () => {
    return (<Grid className={styles.container}>
      <Skeleton variant="rectangular" width={220} height={30}/>
      <Grid className={styles.skeleton_container}>
        {Array.from({ length: 1000 }).map((_, index) => (<Skeleton key={index} variant="rectangular" width={240} height={320}/>))}
      </Grid>
    </Grid>);
};
export default FavoriteSkeleton;
