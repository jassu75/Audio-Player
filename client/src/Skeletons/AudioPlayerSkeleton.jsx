import Skeleton from "@mui/material/Skeleton";
import Grid2 from "@mui/material/Grid2";
import styles from "./audioPlayerSkeleton.module.css";

const AudioPlayerSkeleton = () => {
  return (
    <Grid2 className={styles.container}>
      <Grid2 className={styles.audio_content}>
        <Skeleton
          variant="rect"
          width={400}
          height={400}
          sx={{ maxWidth: "100%" }}
        />
        <Skeleton variant="rect" width={150} height={20} />
        <Grid2 className={styles.audio_controls}>
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="rect" width={25} height={25} />
          <Skeleton variant="circular" width={30} height={30} />
        </Grid2>
        <Skeleton variant="rect" width="100%" height={12} />
      </Grid2>
    </Grid2>
  );
};

export default AudioPlayerSkeleton;
