import Grid2 from "@mui/material/Grid2";
import styles from "./homepage.module.css";
import Navbar from "../../components/navbar/Navbar";

import PlaylistRail from "../../components/playlist-rail/PlaylistRail";
import { useSelector } from "react-redux";
import { playlistCollectionSelector } from "../../redux/selectors/homepageSelectors.js";
import HomepageSkeleton from "../../components/skeletons/homepage/HomepageSkeleton";
const Home = () => {
  const playlistCollection = useSelector(playlistCollectionSelector);
  if (!playlistCollection) return <HomepageSkeleton />;

  return (
    <Grid2 className={styles.container}>
      <Navbar />
      {playlistCollection.map((collection) => (
        <PlaylistRail key={collection.id} collection={collection} />
      ))}
    </Grid2>
  );
};

export default Home;
