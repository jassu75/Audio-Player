import React from "react";
import useSongHashMap from "../hooks/useInitializeHomepage";
import HomepageSongsList from "../Songlist/HomepageSongs/homepageSongsList";
import TopBar from "./TopBar";
import Grid2 from "@mui/material/Grid2";
import styles from "./homepage.module.css";
import { useSelector } from "react-redux";

const Homepage = () => {
  const { loading, error } = useSongHashMap();
  const songsList = useSelector((state) => state.homepage.songs);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Grid2 className={styles.container}>
      <TopBar />
      <HomepageSongsList songsList={songsList} />
    </Grid2>
  );
};

export default Homepage;
