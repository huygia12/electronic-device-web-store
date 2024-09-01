import { ReactNode, createContext, useLayoutEffect } from "react";
import { Nullable, Optional } from "@/utils/declare";
import useCustomNavigate from "@/hooks/use-custom-navigate";
import { LoginFormProps } from "@/utils/schema";
import { authApis } from "@/services/apis";
import auth from "@/utils/auth";
import { Role } from "@/utils/constants";
import useCurrentUser from "@/hooks/use-current-user";

interface AuthContextProps {
  login: (data: LoginFormProps, goBack?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const blackList: string[] = ["/login", "/signup"];

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { location, navigate } = useCustomNavigate();
  const { currentUser, setCurrentUser, updateCurrentUser } = useCurrentUser();

  useLayoutEffect(() => {
    const checkAccessToken = async (): Promise<boolean> => {
      const accessToken: Nullable<string> = auth.token.getAccessToken();

      if (!accessToken && !blackList.includes(location.pathname)) {
        const newAccessToken: Optional<string> = await authApis.refreshToken();
        if (!newAccessToken) {
          return false;
        }
        auth.token.setAccessToken(newAccessToken);

        await updateCurrentUser();
      }

      return true;
    };

    const runMiddleware = async () => {
      await checkAccessToken();
    };

    runMiddleware();
  }, []);

  const login = async (data: LoginFormProps, goBack: boolean = true) => {
    const from: Optional<string> = location.state?.from;

    const accessToken = await authApis.login(data);
    auth.token.setAccessToken(accessToken);

    await updateCurrentUser();
    console.log("from", from);
    navigate(
      goBack && from
        ? from === "/logout"
          ? "/"
          : from
        : currentUser?.role === Role.ADMIN
          ? "/admin"
          : "/"
    );
  };

  const logout = async () => {
    try {
      await authApis.logout();
    } catch (error) {
      console.error(`Response data: ${error}`);
    } finally {
      auth.token.removeAccessToken();
      setCurrentUser(null);
      navigate("/login", { state: { from: "/logout" } });
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {currentUser !== undefined && children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, type AuthContextProps };
export default AuthContext;
