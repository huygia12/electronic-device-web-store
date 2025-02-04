import { ReactNode, createContext, useLayoutEffect, useRef } from "react";
import useCustomNavigate from "@/hooks/use-custom-navigate";
import { LoginFormProps } from "@/utils/schema";
import { authService } from "@/services";
import { Role } from "@/types/enum";
import useCurrentUser from "@/hooks/use-current-user";
import { useSocket } from "@/hooks";

interface AuthContextProps {
  login: (data: LoginFormProps, goBack?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { location, navigate } = useCustomNavigate();
  const { currentUser, setCurrentUser, updateCurrentUser } = useCurrentUser();
  const { socket } = useSocket();
  const middlewareChecked = useRef<boolean>(false);

  useLayoutEffect(() => {
    const checkAccessToken = async (): Promise<boolean> => {
      const accessToken: string | null = authService.token.getAccessToken();

      if (!accessToken) {
        const newAccessToken: string | undefined =
          await authService.apis.refreshToken();
        if (!newAccessToken) {
          return false;
        }
        authService.token.setAccessToken(newAccessToken);
      }

      return true;
    };

    const runMiddleware = async () => {
      const validAT = await checkAccessToken();

      //After: Update the user after get a new AT in sessionStorage
      await updateCurrentUser();
      const user = authService.getUser();
      if (validAT && user) {
        socket?.emit(`user:join`, { userID: user.userID });
        if (user.role == Role.ADMIN) {
          socket?.emit(`admin:join`);
        }
      }
    };

    // only checking middlewares once when app is initialized
    !middlewareChecked.current && runMiddleware();
    middlewareChecked.current = true;
  }, []);

  const login = async (data: LoginFormProps, goBack: boolean = true) => {
    const from: string | undefined = location.state?.from;

    const accessToken = await authService.apis.login(data);
    authService.token.setAccessToken(accessToken);

    await updateCurrentUser();
    socket?.emit(`user:join`, { userID: authService.getUser()!.userID });
    if (authService.getUser()!.role == Role.ADMIN) {
      socket?.emit(`admin:join`);
    }

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
      authService.token.removeAccessToken();
      socket?.emit(`user:leave`, { userID: currentUser!.userID });
      if (currentUser!.role == Role.ADMIN) {
        socket?.emit(`admin:leave`);
      }
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
