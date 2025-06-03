import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAudiusAlbums } from "../Songlist/HomepageSongs/homepage.slice";

const useAudiusAlbums = () => {
  const [AudiusAlbumsLoading, setAudiusAlbumsLoading] = useState(false);
  const [AudiusAlbumsError, setAudiusAlbumsError] = useState(false);
  const dispatch = useDispatch();
  const audiusAlbums = useSelector((state) => state.homepage.audiusAlbums);

  useEffect(() => {
    const fetchAudiusAlbums = async () => {
      try {
        if (!audiusAlbums) {
          setAudiusAlbumsLoading(true);
          const response = await axios.get("/api/audius/fetchTopAlbums");
          const refinedAlbums = response.data.data.map((album) => ({
            id: album.id,
            title: album.playlist_name,
            cover_art: album.artwork["480x480"],
          }));
          dispatch(setAudiusAlbums(refinedAlbums));
        }
      } catch (error) {
        setAudiusAlbumsError(true);
        console.error("Error fetching Audius Albums", error);
      } finally {
        setAudiusAlbumsLoading(false);
      }
    };
    fetchAudiusAlbums();
  }, []);

  return { AudiusAlbumsLoading, AudiusAlbumsError };
};

export default useAudiusAlbums;
