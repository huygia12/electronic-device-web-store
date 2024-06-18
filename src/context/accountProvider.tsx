import { Account } from "@/declare";
import { ReactNode, createContext, useState } from "react";

interface AccountContextProps {
  currAccount: Account | undefined;
  setCurrAccount: (account: Account | undefined) => void;
}

const AccountContext = createContext<AccountContextProps>({
  currAccount: undefined,
  setCurrAccount: () => {},
});

const AccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currAccount, setCurrAccount] = useState<Account | undefined>();

  const value: AccountContextProps = {
    currAccount,
    setCurrAccount,
  };
  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

export { AccountContext };
export default AccountProvider;
