import axios from "axios";
import { auth } from "./firebase";

const axiosAuth = axios.create();

axiosAuth.interceptors.request.use(async (config) => {
  await auth.authStateReady();
  const token = await auth.currentUser?.getIdToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAuth;
