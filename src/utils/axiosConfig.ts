import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/v1",
  timeout: 5000, // Timeout set to 5 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

const reqConfig: AxiosRequestConfig = {
  withCredentials: true, // Include credentials in requests
};

export { axiosInstance, reqConfig };
