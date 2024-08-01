import { UserContext } from "@/context";
import { useContext } from "react";

const useCurrentUser = () => {
  const { currUser, setCurrUser, clearCurrUser } = useContext(UserContext);

  return { currUser, setCurrUser, clearCurrUser };
};

export default useCurrentUser;
