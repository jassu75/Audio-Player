import useCloudinaryUpload from "./useCloudinaryUpload";
const useCloudinaryAudioUpload = () => {
  const { upload, loading } = useCloudinaryUpload("audio");
  return { uploadAudioToCloudinary: upload, loading };
};
export default useCloudinaryAudioUpload;
