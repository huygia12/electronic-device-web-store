import { AccountSummary } from "@/declare";
import { useLocalStorage } from "@/utils/customHook";
import { ReactNode, createContext } from "react";

interface AccountContextProps {
  currAccount: AccountSummary | undefined;
  setCurrAccount: (account: AccountSummary | undefined) => void;
  clearCurrAccount: () => void;
}

const AccountContext = createContext<AccountContextProps>({
  currAccount: undefined,
  setCurrAccount: () => {},
  clearCurrAccount: () => {},
});

const AccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currAccount, setCurrAccount, clearCurrAccount] = useLocalStorage<
    AccountSummary | undefined
  >("account", undefined);

  const value: AccountContextProps = {
    currAccount,
    setCurrAccount,
    clearCurrAccount,
  };
  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

export { AccountContext };
export default AccountProvider;
