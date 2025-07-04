import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/homepage.selector";
import {
  addFavorite,
  deleteFavorite,
} from "../../redux/slices/userPreferences.slice";

const useUpdateFavorites = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  const addFavoriteId = async (songId) => {
    try {
      dispatch(addFavorite(songId));

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
    } catch (error) {
      console.error("error adding favorites", error);
    }
  };

  const deleteFavoriteId = async (songId) => {
    try {
      dispatch(deleteFavorite(songId));

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
    } catch (error) {
      console.error("error deleting favorites", error);
    }
  };
  return { addFavoriteId, deleteFavoriteId };
};

export default useUpdateFavorites;
