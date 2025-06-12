import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAudiusAlbums } from "../Songlist/HomepageSongs/homepage.slice";

const useAudiusAlbums = () => {
  const [audiusAlbumsLoading, setAudiusAlbumsLoading] = useState(false);
  const [audiusAlbumsError, setAudiusAlbumsError] = useState(false);
  const dispatch = useDispatch();
  const audiusAlbums = useSelector((state) => state.homepage.audiusAlbums);

  useEffect(() => {
    const fetchAudiusAlbums = async () => {
      try {
        setAudiusAlbumsLoading(true);
        const response = await axios.get("/json/audius.json");
        const refinedAlbums = response.data.data.map((album) => ({
          id: album.id,
          title: album.playlist_name,
          cover_art: album.artwork["150x150"],
        }));
        dispatch(setAudiusAlbums(refinedAlbums));
      } catch (error) {
        setAudiusAlbumsError(true);
        console.error("Error fetching Audius Albums", error);
      } finally {
        setAudiusAlbumsLoading(false);
      }
    };
    if (!audiusAlbums) {
      fetchAudiusAlbums();
    }
  }, []);

  return { audiusAlbumsLoading, audiusAlbumsError };
};

export default useAudiusAlbums;
