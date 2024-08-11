import { ReactNode, createContext, useLayoutEffect } from "react";
import { Nullable, Optional } from "@/utils/declare";
import useCustomNavigate from "@/hooks/use-custom-navigate";
import { AxiosResponse, HttpStatusCode } from "axios";
import { LoginFormProps } from "@/schema";
import { authApis } from "@/services/apis";
import auth from "@/utils/auth";
import { AuthUser } from "@/types/api";
import { Role } from "@/utils/constants";

interface AuthContextProps {
  login: (data: LoginFormProps, goBack?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const blackList: string[] = ["/login", "/signup"];

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { navigate, location } = useCustomNavigate();

  useLayoutEffect(() => {
    const checkAccessToken = async (): Promise<boolean> => {
      const accessToken: Nullable<string> = auth.token.getAccessToken();

      if (!accessToken && !blackList.includes(location.pathname)) {
        const newAccessToken: Optional<string> = await authApis.refreshToken();
        if (!newAccessToken) {
          return false;
        }
        auth.token.setAccessToken(newAccessToken);
      }

      return true;
    };

    const runMiddleware = async () => {
      await checkAccessToken();
    };

    runMiddleware();
  }, [location.pathname]);

  const login = async (data: LoginFormProps, goBack: boolean = true) => {
    const from: Optional<string> = location.state?.from;

    const accessToken = await authApis.login(data);
    auth.token.setAccessToken(accessToken);

    const userDecoded: Nullable<AuthUser> = auth.getUser();
    if (!userDecoded) throw new Error(`UserDecoded is ${userDecoded}`);

    navigate(
      goBack && from ? from : userDecoded.role === Role.ADMIN ? "/admin" : "/"
    );
  };

  const logout = async () => {
    const res: AxiosResponse = await authApis.logout();
    if (res.status === HttpStatusCode.Ok) {
      window.sessionStorage.clear();
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, type AuthContextProps };
export default AuthContext;
