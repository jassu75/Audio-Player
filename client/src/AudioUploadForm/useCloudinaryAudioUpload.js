import { useState } from "react";
import axios from "axios";
import { auth } from "../config/firebase";

const useCloudinaryAudioUpload = () => {
  const [loading, setLoading] = useState(false);

  const uploadAudioToCloudinary = async (file) => {
    setLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      if (token) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          "/api/cloudinary/uploadaudio",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      }
    } catch (error) {
      console.error("Error occurred during audio upload:", error);
    } finally {
      setLoading(false);
    }
  };

  return { uploadAudioToCloudinary, loading };
};

export default useCloudinaryAudioUpload;
