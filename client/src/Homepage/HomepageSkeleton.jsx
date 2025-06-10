import Grid2 from "@mui/material/Grid2";
import Skeleton from "@mui/material/Skeleton";
import styles from "./homepageSkeleton.module.css";

const HomepageSkeleton = () => {
  return (
    <Grid2 className={styles.skeleton_container}>
      <Grid2 className={styles.user_welcome}>
        <Grid2 className={styles.profile}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rect" width={200} height={25} />
        </Grid2>
        <Grid2 className={styles.icons}>
          <Skeleton variant="circular" width={35} height={35} />
        </Grid2>
      </Grid2>
      <Grid2 className={styles.album_container}>
        <Skeleton variant="rect" width={200} height={25} />
        <Grid2 className={styles.album}>
          {Array.from({ length: 1000 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={150}
              height={170}
              sx={{ flexShrink: 0, borderRadius: "8px" }}
            />
          ))}
        </Grid2>
      </Grid2>
      <Grid2 className={styles.album_title}>
        <Skeleton variant="rect" width={200} height={25} />
      </Grid2>

      <Grid2 className={styles.song}>
        {Array.from({ length: 1000 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rect"
            width={450}
            height={80}
            sx={{ flexShrink: 0, maxWidth: "98%" }}
          />
        ))}
      </Grid2>
    </Grid2>
  );
};

export default HomepageSkeleton;
