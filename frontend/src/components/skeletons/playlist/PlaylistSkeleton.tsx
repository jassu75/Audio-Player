import { Grid, Skeleton } from "@mui/material";
import styles from "./playlistSkeleton.module.css";
const PlaylistSkeleton = () => {
    return (<Grid className={styles.container}>
      <Grid className={styles.heading}>
        <Skeleton variant="rectangular" width={200} height={25}/>
      </Grid>
      <Grid className={styles.song}>
        {Array.from({ length: 1000 }).map((_, index) => (<Skeleton key={index} variant="rectangular" width={450} height={70} sx={{ flexShrink: 0, maxWidth: "98%" }}/>))}
      </Grid>
    </Grid>);
};
export default PlaylistSkeleton;
