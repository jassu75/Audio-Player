import { useState } from "react";

const useCloudinaryAudioUpload = () => {
  const [loading, setLoading] = useState(false);

  const uploadAudioToCloudinary = async (file) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "audio_upload");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dcr1wsbyi/raw/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Error response:", data);
        throw new Error(data.error?.message || "Failed to upload audio.");
      }

      return data.secure_url;
    } catch (error) {
      console.error("Error occurred during audio upload:", error);
    } finally {
      setLoading(false);
    }
  };

  return { uploadAudioToCloudinary, loading };
};

export default useCloudinaryAudioUpload;
