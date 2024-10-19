import { ReactNode, createContext, useState } from "react";
import { authService, userService } from "@/services";
import { BaseUser, User } from "@/types/model";

interface CurrentUserContextProps {
  currentUser: User | undefined | null;
  setCurrentUser: (user: User | null) => void;
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
    const userHolder: BaseUser | null = authService.getUser();
    let user: User | null = null;
    if (userHolder) {
      user = await userService.apis.getUser(userHolder.userID);
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
