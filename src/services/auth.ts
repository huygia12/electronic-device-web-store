import { AxiosResponse } from "axios";
import { axiosInstance, reqConfig } from "@/config";
import { LoginFormProps } from "@/utils/schema";
import { BaseUser } from "@/types/model";
import { jwtDecode } from "jwt-decode";

const TOKEN_NAME: string = "access_token";
const userEndpoint = "/users";

const authService = {
  apis: {
    refreshToken: async (): Promise<string | undefined> => {
      try {
        const res = await axiosInstance.get(
          `${userEndpoint}/refresh`,
          reqConfig
        );

        const accessToken: string | undefined = res.data.info.accessToken;

        return accessToken;
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    },
    login: async (data: LoginFormProps): Promise<string> => {
      const res = await axiosInstance.post(
        `${userEndpoint}/login`,
        {
          email: data.email.trim(),
          password: data.password.trim(),
        },
        reqConfig
      );

      const accessToken: string | undefined = res.data.info.accessToken;
      if (!accessToken) {
        throw new Error(`Access token is undefined`);
      }

      return accessToken;
    },
    logout: async (): Promise<AxiosResponse> => {
      const res = await axiosInstance.delete(
        `${userEndpoint}/logout`,
        reqConfig
      );

      return res;
    },
  },
  token: {
    name: TOKEN_NAME,
    getAccessToken: () => window.sessionStorage.getItem(TOKEN_NAME),
    setAccessToken: (token: string) =>
      window.sessionStorage.setItem(TOKEN_NAME, token),
    removeAccessToken: () => window.sessionStorage.removeItem(TOKEN_NAME),
  },
  getUser: function (): BaseUser | null {
    try {
      const rawToken: string | null | undefined =
        window.sessionStorage.getItem("access_token");
      if (!rawToken) return null;

      const tokenDecoded = jwtDecode<BaseUser>(rawToken);
      if (!tokenDecoded.userID) return null;

      const userDecoded: BaseUser = {
        ...tokenDecoded,
      };

      return userDecoded;
    } catch {
      return null;
    }
  },
};

export default authService;
