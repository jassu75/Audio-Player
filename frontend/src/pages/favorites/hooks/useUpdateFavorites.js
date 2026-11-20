import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../../redux/selectors/homepageSelectors.js";
import {
  addFavorite,
  deleteFavorite,
} from "../../../redux/slices/userPreferencesSlice.js";

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
        },
      );
      dispatch(addFavorite(songId));
    } catch (error) {
      console.error("Error adding favorite", error);
      throw error;
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
        },
      );
      dispatch(deleteFavorite(songId));
    } catch (error) {
      console.error("Error deleting favorite", error);
      throw error;
    }
  };
  return { addFavoriteId, deleteFavoriteId };
};

export default useUpdateFavorites;
