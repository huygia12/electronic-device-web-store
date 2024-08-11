import auth from "@/utils/auth";
import { Nullable, Optional } from "@/utils/declare";
import axios, { AxiosRequestConfig } from "axios";
import { fromUnixTime, isAfter } from "date-fns";
import { InvalidTokenError, jwtDecode } from "jwt-decode";
import { authApis } from "../apis";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 100000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosInstanceWithoutAuthorize = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 100000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export const reqConfig: AxiosRequestConfig = {
  withCredentials: true, // Include credentials in requests
};

axiosInstance.interceptors.request.use(async (config) => {
  let accessToken: Nullable<string> = auth.token.getAccessToken();
  if (accessToken) {
    try {
      const tokenDecoded = jwtDecode<{ exp: number }>(accessToken);

      //If access token is expired
      if (!isAfter(fromUnixTime(tokenDecoded.exp), Date.now())) {
        const newAccessToken: Optional<string> = await authApis.refreshToken();
        console.debug("AXIOS CONFIG : request new AT", newAccessToken);

        if (newAccessToken) {
          auth.token.setAccessToken(newAccessToken);
          accessToken = newAccessToken;
        }
      }
    } catch (error) {
      if (error instanceof InvalidTokenError)
        console.debug("AXIOS CONFIG : TOKEN DECODED : Invalid token");
      else console.debug(`AXIOS CONFIG : UNEXPECTED ${error}`);
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
