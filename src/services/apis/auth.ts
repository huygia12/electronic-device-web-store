import { Optional } from "@/utils/declare";
import axios, { AxiosResponse } from "axios";
import { axiosInstanceWithoutAuthorize, reqConfig } from "@/services/axios";
import { LoginFormProps } from "@/schema";

const authApis = {
  refreshToken: async (): Promise<Optional<string>> => {
    try {
      const res = await axiosInstanceWithoutAuthorize.get(
        `${import.meta.env.VITE_API_URL}/users/refresh`,
        reqConfig
      );

      const accessToken: Optional<string> = res.data.info.accessToken;

      return accessToken;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error response: ${error.response}`);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  },
  login: async (data: LoginFormProps): Promise<string> => {
    const res = await axiosInstanceWithoutAuthorize.post(
      `${import.meta.env.VITE_API_URL}/users/login`,
      {
        email: data.email.trim(),
        password: data.password.trim(),
      },
      reqConfig
    );

    const accessToken: Optional<string> = res.data.info.accessToken;
    if (!accessToken) {
      console.debug("AUTH APIS: access token: ", JSON.stringify(accessToken));
      throw new Error(`Access token is undefined`);
    }

    return accessToken;
  },
  logout: async (): Promise<AxiosResponse> => {
    const res = await axiosInstanceWithoutAuthorize.delete(
      `/users/logout`,
      reqConfig
    );

    return res;
  },
};

export default authApis;
