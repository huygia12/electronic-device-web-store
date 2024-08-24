import { ReactNode, createContext, useEffect, useState } from "react";
import { Nullable } from "@/utils/declare";
import { userApis } from "@/services/apis";
import auth from "@/utils/auth";
import { AuthUser, User } from "@/types/api";

interface CurrentUserContextProps {
  currentUser: Nullable<User>;
  setCurrentUser: (user: Nullable<User>) => void;
  updateCurrentUser: () => Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextProps | undefined>(
  undefined
);

const CurrentUserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<Nullable<User>>(null);

  const updateCurrentUser = async () => {
    const userHolder: Nullable<AuthUser> = auth.getUser();
    if (userHolder) {
      const user = await userApis.getUser(userHolder.userID);
      setCurrentUser(user);
    }
  };

  useEffect(() => {
    updateCurrentUser();
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, updateCurrentUser }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export { CurrentUserProvider, type CurrentUserContextProps };
export default CurrentUserContext;
