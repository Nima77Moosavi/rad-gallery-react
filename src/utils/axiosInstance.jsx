import axios from "axios";
import { API_URL } from "../config";

const axiosInstance = axios.create({ baseURL: API_URL });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      // drop stale token
      localStorage.removeItem("accessToken");
      // send user to login (full-page reload)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
