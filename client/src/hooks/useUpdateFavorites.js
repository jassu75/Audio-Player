import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  deleteFavorite,
} from "../redux/slices/userPreferences.slice";
import { userSelector } from "../redux/selectors/homepage.selector";

const useUpdateFavorites = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  const addFavoriteId = async (songId) => {
    try {
      await axios.post(
        "/api/addfavorite",
        {
          user_id: user.user_id,
          favorite_id: songId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(addFavorite(songId));
    } catch (error) {
      console.error("error adding favorites", error);
    }
  };

  const deleteFavoriteId = async (songId) => {
    try {
      await axios.post(
        "/api/deletefavorite",
        {
          user_id: user.user_id,
          favorite_id: songId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(deleteFavorite(songId));
    } catch (error) {
      console.error("error deleting favorites", error);
    }
  };
  return { addFavoriteId, deleteFavoriteId };
};

export default useUpdateFavorites;
