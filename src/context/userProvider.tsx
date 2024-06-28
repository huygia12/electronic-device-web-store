import { UserSummary } from "@/declare";
import { useLocalStorage } from "@/utils/customHook";
import { ReactNode, createContext } from "react";

interface UserContextProps {
  currUser: UserSummary | undefined;
  setCurrUser: (user: UserSummary | undefined) => void;
  clearCurrUser: () => void;
}

const UserContext = createContext<UserContextProps>({
  currUser: undefined,
  setCurrUser: () => {},
  clearCurrUser: () => {},
});

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currUser, setCurrUser, clearCurrUser] = useLocalStorage<
    UserSummary | undefined
  >("user", undefined);

  const value: UserContextProps = {
    currUser,
    setCurrUser,
    clearCurrUser,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext };
export default UserProvider;
