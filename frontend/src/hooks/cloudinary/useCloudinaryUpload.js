import { useState } from "react";
import axiosAuth from "../../config/axiosAuth";

const useCloudinaryUpload = (type) => {
  const [loading, setLoading] = useState(false);
  const upload = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axiosAuth.post("/api/cloudinary/upload" + type, formData);
      return response.data;
    } finally {
      setLoading(false);
    }
  };
  return { upload, loading };
};

export default useCloudinaryUpload;
