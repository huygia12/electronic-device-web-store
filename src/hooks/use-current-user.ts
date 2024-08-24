import CurrentUserContext, {
  CurrentUserContextProps,
} from "@/context/current-user-context";
import { useContext } from "react";

const useCurrentUser = (): CurrentUserContextProps => {
  const currentUserContext = useContext(CurrentUserContext);

  if (!currentUserContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return currentUserContext;
};

export default useCurrentUser;
