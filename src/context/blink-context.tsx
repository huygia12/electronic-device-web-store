import { Optional } from "@/utils/declare";
import { ReactNode, createContext, useState } from "react";

export interface BlinkContextProps {
  isBlink: boolean;
  makeBlink: () => void;
}

const BlinkContext = createContext<Optional<BlinkContextProps>>(undefined);

const BlinkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isBlink, setIsBlink] = useState<boolean>(false);

  const setBlink = () => {
    setIsBlink(true);
    setTimeout(() => setIsBlink(false), 1000);
  };

  const value: BlinkContextProps = {
    isBlink: isBlink,
    makeBlink: setBlink,
  };

  return (
    <BlinkContext.Provider value={value}>{children}</BlinkContext.Provider>
  );
};

export { BlinkProvider };
export default BlinkContext;
