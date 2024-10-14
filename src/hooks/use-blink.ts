import { BlinkContext, BlinkContextProps } from "@/context";
import { useContext } from "react";

const useBlink = (): BlinkContextProps => {
  const blinkContext = useContext(BlinkContext);

  if (!blinkContext) {
    throw new Error(
      "useCurrentUser must be used within an CurrentUserProvider"
    );
  }

  return blinkContext;
};

export default useBlink;
