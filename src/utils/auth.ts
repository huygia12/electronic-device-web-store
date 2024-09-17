import { AuthUser } from "@/types/model";
import { jwtDecode } from "jwt-decode";
import { Nullable } from "./declare";

const TOKEN_NAME: string = "access_token";

const auth = {
  token: {
    name: TOKEN_NAME,
    getAccessToken: () => window.sessionStorage.getItem(TOKEN_NAME),
    setAccessToken: (token: string) =>
      window.sessionStorage.setItem(TOKEN_NAME, token),
    removeAccessToken: () => window.sessionStorage.removeItem(TOKEN_NAME),
  },
  getUser: function (): Nullable<AuthUser> {
    try {
      const rawToken: string | null | undefined =
        window.sessionStorage.getItem("access_token");
      if (!rawToken) return null;

      const tokenDecoded = jwtDecode<AuthUser>(rawToken);
      if (!tokenDecoded.userID) return null;

      const userDecoded: AuthUser = {
        ...tokenDecoded,
      };

      return userDecoded;
    } catch {
      console.debug("Invalid token!");
      return null;
    }
  },
};

export default auth;
