import axios from "axios";
import authHeader from "./authHeader";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const headers = authHeader();
    config.headers = headers;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axiosInstance;
