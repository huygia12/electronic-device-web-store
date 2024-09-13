import { ReactNode, createContext, useState } from "react";
import { Nullable } from "@/utils/declare";
import { userApis } from "@/services/apis";
import auth from "@/utils/auth";
import { AuthUser, User } from "@/types/api";

interface CurrentUserContextProps {
  currentUser: User | undefined | null;
  setCurrentUser: (user: Nullable<User>) => void;
  updateCurrentUser: () => Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextProps | undefined>(
  undefined
);

/**
 * Only enables user view pages when currentUser is not undefined.
 * Should be used in app.ts file.
 */
const CurrentUserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  );

  const updateCurrentUser = async () => {
    const userHolder: Nullable<AuthUser> = auth.getUser();
    let user: Nullable<User> = null;
    if (userHolder) {
      user = await userApis.getUser(userHolder.userID);
    }
    setCurrentUser(user);
  };

  // useEffect(() => {
  //   updateCurrentUser();
  // }, []);

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, updateCurrentUser }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export {
  CurrentUserProvider,
  CurrentUserContext,
  type CurrentUserContextProps,
};
