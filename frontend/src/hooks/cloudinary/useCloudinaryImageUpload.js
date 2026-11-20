import useCloudinaryUpload from "./useCloudinaryUpload";

const useCloudinaryImageUpload = () => {
  const { upload, loading } = useCloudinaryUpload("image");
  return { uploadImageToCloudinary: upload, loading };
};

export default useCloudinaryImageUpload;
