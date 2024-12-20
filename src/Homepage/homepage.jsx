import React from "react";
import useSongHashMap from "../hooks/useInitializeHomepage";
import HomepageSongsList from "../Songlist/HomepageSongs/homepageSongsList";
import TopBar from "./TopBar";
import Grid2 from "@mui/material/Grid2";
import styles from "./homepage.module.css";
import { useSelector } from "react-redux";
import UserWelcome from "./UserWelcome";
import Typography from "@mui/material/Typography";

const Homepage = () => {
  const { loading, error } = useSongHashMap();
  const homepageSongsList = useSelector(
    (state) => state.homepage?.user?.homepage_songs
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Grid2 className={styles.container}>
      <UserWelcome />
      <TopBar />
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Your Songs
        </Typography>
      </Grid2>
      <HomepageSongsList songsList={homepageSongsList} />
    </Grid2>
  );
};

export default Homepage;
