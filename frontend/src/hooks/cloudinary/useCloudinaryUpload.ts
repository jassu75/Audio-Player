import { useState } from "react";
import axiosAuth from "../../config/axiosAuth";
import type { UploadResponses } from "./types/useCloudinaryUpload.types";
const useCloudinaryUpload = <Type extends keyof UploadResponses>(type: Type) => {
    const [loading, setLoading] = useState(false);
    const upload = async (file: Blob) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await axiosAuth.post<UploadResponses[Type]>("/api/cloudinary/upload" + type, formData);
            return response.data;
        }
        finally {
            setLoading(false);
        }
    };
    return { upload, loading };
};
export default useCloudinaryUpload;
