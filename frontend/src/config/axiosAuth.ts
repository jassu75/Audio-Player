import axios from "axios";
const axiosAuth = axios.create({
  withCredentials: true,
  headers: { "X-Musify-Request": "1" },
});
export default axiosAuth;
