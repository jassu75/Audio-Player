import Grid2 from "@mui/material/Grid2";
import styles from "./homepage.module.css";
import UserWelcome from "../../components/navbar/Navbar";

import PlaylistRail from "../../components/playlisRail/PlaylistRail";
import { useSelector } from "react-redux";
import { playlistCollectionSelector } from "../../redux/selectors/homepage.selector";
import HomepageSkeleton from "../../components/skeletons/homepage/HomepageSkeleton";
const Homepage = () => {
  const playlistCollection = useSelector(playlistCollectionSelector);
  if (!playlistCollection) return <HomepageSkeleton />;

  return (
    <Grid2 className={styles.container}>
      <UserWelcome />
      {playlistCollection.map((collection) => (
        <PlaylistRail key={collection.id} collection={collection} />
      ))}
    </Grid2>
  );
};

export default Homepage;
