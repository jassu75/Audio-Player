import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAudiusAlbums } from "../../../redux/slices/homepage.slice";
import { audiusPlaylistsSelector } from "../../../redux/selectors/homepage.selector";

const useFetchAudiusAlbums = () => {
  const [audiusAlbumsLoading, setAudiusAlbumsLoading] = useState(false);
  const [audiusAlbumsError, setAudiusAlbumsError] = useState(false);
  const dispatch = useDispatch();
  const audiusAlbums = useSelector(audiusPlaylistsSelector);

  useEffect(() => {
    const fetchAudiusAlbums = async () => {
      try {
        setAudiusAlbumsLoading(true);
        const response = await axios.get("/json/audius.json");
        const refinedResponse = response.data.data.reduce((acc, album) => {
          acc[album.id] = {
            id: album.id,
            title: album.playlist_name,
            cover_art: album.artwork["150x150"],
          };
          return acc;
        }, {});
        dispatch(setAudiusAlbums(refinedResponse));
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

export default useFetchAudiusAlbums;
