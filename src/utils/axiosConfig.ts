import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000, // Timeout set to 5 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

const reqConfig: AxiosRequestConfig = {
  withCredentials: true, // Include credentials in requests
};

export { axiosInstance, reqConfig };
