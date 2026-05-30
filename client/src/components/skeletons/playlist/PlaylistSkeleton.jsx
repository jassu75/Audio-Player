import { Grid2, Skeleton } from "@mui/material";
import styles from "./playlistSkeleton.module.css";

const PlaylistSkeleton = () => {
  return (
    <Grid2 className={styles.container}>
      <Grid2 className={styles.heading}>
        <Skeleton variant="rect" width={200} height={25} />
      </Grid2>
      <Grid2 className={styles.song}>
        {Array.from({ length: 1000 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rect"
            width={450}
            height={70}
            sx={{ flexShrink: 0, maxWidth: "98%" }}
          />
        ))}
      </Grid2>
    </Grid2>
  );
};

export default PlaylistSkeleton;
