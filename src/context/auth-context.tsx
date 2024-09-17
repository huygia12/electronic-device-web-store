import { ReactNode, createContext, useLayoutEffect, useRef } from "react";
import { Nullable, Optional } from "@/utils/declare";
import useCustomNavigate from "@/hooks/use-custom-navigate";
import { LoginFormProps } from "@/utils/schema";
import { authService } from "@/services";
import auth from "@/utils/auth";
import { Role } from "@/types/enum";
import useCurrentUser from "@/hooks/use-current-user";

interface AuthContextProps {
  login: (data: LoginFormProps, goBack?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { location, navigate } = useCustomNavigate();
  const { currentUser, setCurrentUser, updateCurrentUser } = useCurrentUser();
  const middlewareChecked = useRef<boolean>(false);

  useLayoutEffect(() => {
    const checkAccessToken = async (): Promise<boolean> => {
      const accessToken: Nullable<string> = auth.token.getAccessToken();

      if (!accessToken) {
        const newAccessToken: Optional<string> =
          await authService.apis.refreshToken();
        if (!newAccessToken) {
          return false;
        }
        auth.token.setAccessToken(newAccessToken);
      }

      return true;
    };

    const runMiddleware = async () => {
      await checkAccessToken();

      //After: Update the user after get a new AT in sessionStorage
      await updateCurrentUser();
    };

    // only checking middlewares once when app is initialized
    !middlewareChecked.current && runMiddleware();
    middlewareChecked.current = true;
  }, []);

  const login = async (data: LoginFormProps, goBack: boolean = true) => {
    const from: Optional<string> = location.state?.from;

    const accessToken = await authService.apis.login(data);
    auth.token.setAccessToken(accessToken);

    await updateCurrentUser();
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
      await authService.apis.logout();
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
