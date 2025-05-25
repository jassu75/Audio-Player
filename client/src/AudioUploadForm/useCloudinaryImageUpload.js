import { useState } from "react";

const useCloudinaryImageUpload = () => {
  const [loading, setLoading] = useState(false);

  const uploadImageToCloudinary = async (image) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "image_upload");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dcr1wsbyi/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Error response:", data);
        throw new Error(data.error?.message || "Failed to upload image.");
      }

      return data.secure_url;
    } catch (error) {
      console.error("Error occurred during image upload:", error);
    } finally {
      setLoading(false);
    }
  };

  return { uploadImageToCloudinary, loading };
};

export default useCloudinaryImageUpload;
