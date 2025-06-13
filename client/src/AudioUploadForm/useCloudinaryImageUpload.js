import { useState } from "react";
import axios from "axios";
import { auth } from "../config/firebase";
const useCloudinaryImageUpload = () => {
  const [loading, setLoading] = useState(false);

  const uploadImageToCloudinary = async (image) => {
    setLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      if (token) {
        const formData = new FormData();
        formData.append("file", image);

        const response = await axios.post(
          "/api/cloudinary/uploadimage",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const imageUrl = response.data.imageUrl;
        return imageUrl;
      }
    } catch (error) {
      console.error("Error occurred during image upload:", error);
    } finally {
      setLoading(false);
    }
  };

  return { uploadImageToCloudinary, loading };
};

export default useCloudinaryImageUpload;
