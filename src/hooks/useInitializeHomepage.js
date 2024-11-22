import { useDispatch } from "react-redux";
import { useRef } from "react";
import { setSongs } from "../Songlist/HomepageSongs/homepage.slice";
import songs from "../songs.json";

const useInitializeHomepage = () => {
  const dispatch = useDispatch();
  const isInitialized = useRef(false);

  if (!isInitialized.current) {
    dispatch(setSongs(songs));
    localStorage.setItem("songsList", JSON.stringify(songs));
    isInitialized.current = true;
  }
};

export default useInitializeHomepage;
