import React from "react";
import useSongHashMap from "./hooks/useInitializeHomepage";
import HomepageSongsList from "./Songlist/HomepageSongs/homepageSongsList";

const Homepage = () => {
  const { songsHashMap, loading, error } = useSongHashMap();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  localStorage.setItem("songsList", JSON.stringify(songsHashMap));
  return <HomepageSongsList songsList={songsHashMap} />;
};

export default Homepage;
