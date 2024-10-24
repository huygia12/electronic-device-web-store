import { authService } from "@/services";
import axios, { AxiosRequestConfig } from "axios";
import { fromUnixTime, isAfter } from "date-fns";
import { InvalidTokenError, jwtDecode } from "jwt-decode";

const localHost = "http://127.0.0.1";
const serverUrl =
  import.meta.env.VITE_API_SERVER_URL ||
  `${localHost}:${import.meta.env.VITE_API_SERVER_PORT}`;

const apiUrl = `${serverUrl}/${import.meta.env.VITE_API_VERSION}`;

export const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 100000, // 100 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export const reqConfig: AxiosRequestConfig = {
  withCredentials: true, // Include credentials in requests
};

axiosInstance.interceptors.request.use(async (config) => {
  let accessToken: string | null = authService.token.getAccessToken();
  if (accessToken) {
    try {
      const tokenDecoded = jwtDecode<{ exp: number }>(accessToken);

      //If access token is expired
      if (!isAfter(fromUnixTime(tokenDecoded.exp), Date.now())) {
        const res = await axiosInstance.get(`${apiUrl}/users/refresh`);

        const newAccessToken: string | undefined = res.data.info.accessToken;

        if (newAccessToken) {
          authService.token.setAccessToken(newAccessToken);
          accessToken = newAccessToken;
        }
        console.debug("AXIOS CONFIG : request new AT", newAccessToken);
      }
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        console.debug("AXIOS CONFIG : TOKEN DECODED : Invalid token");
      } else if (axios.isAxiosError(error)) {
        console.error(`Error response: ${error.response}`);
      } else console.debug(`AXIOS CONFIG : UNEXPECTED ${error}`);
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
