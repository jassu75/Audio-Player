import React from "react";
import useInitializeHomepage from "./hooks/useInitializeHomepage";
import HomepageSongsList from "./Songlist/HomepageSongs/homepageSongsList";
import songs from "./songs.json";
import { useSelector } from "react-redux";

const Homepage = () => {
  useInitializeHomepage();
  const songList = useSelector((state) => state.homepage.songs);

  return <HomepageSongsList songsList={songList} />;
};

export default Homepage;
