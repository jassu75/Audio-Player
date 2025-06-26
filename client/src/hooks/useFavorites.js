import axios from "axios";
import { useDispatch } from "react-redux";
import { setFavorite } from "../redux/slices/userPreferences.slice";
import { auth } from "../config/firebase";

const useFavorites = () => {
  const dispatch = useDispatch();

  const updateFavorite = async (favorites) => {
    try {
      dispatch(setFavorite(favorites));
      await axios.post(
        "/api/updatefavorites",
        {
          user_id: auth.currentUser?.uid,
          favorites: favorites,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("error updating favorites", error);
    }
  };
  return { updateFavorite };
};

export default useFavorites;
