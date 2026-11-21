import Grid from "@mui/material/Grid";
import Navbar from "../../components/navbar/Navbar";
import { useAppSelector } from "../../redux/hooks";
import styles from "./homepage.module.css";
import PlaylistRail from "../../components/playlist-rail/PlaylistRail";
import HomepageSkeleton from "../../components/skeletons/homepage/HomepageSkeleton";
import { playlistCollectionSelector } from "../../redux/selectors/homepageSelectors";
import ForYouRail from "../../components/for-you-rail/ForYouRail";
const Home = () => {
    const playlistCollection = useAppSelector(playlistCollectionSelector);
    if (!playlistCollection)
        return <HomepageSkeleton />;
    return (<Grid className={styles.container}>
      <Navbar />
      <ForYouRail />
      {playlistCollection.map((collection) => (<PlaylistRail key={collection.id} collection={collection}/>))}
    </Grid>);
};
export default Home;
