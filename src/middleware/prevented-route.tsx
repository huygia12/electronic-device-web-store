import { useAuth, useCustomNavigate } from "@/hooks";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const PreventedRoute: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { location } = useCustomNavigate();
  const { currentUser } = useAuth();

  return (
    <>
      {currentUser ? (
        <Navigate
          to={location.state?.from || "/"}
          state={{ unstable_useViewTransitionState: true }}
          replace={true}
        />
      ) : (
        children
      )}
    </>
  );
};

export default PreventedRoute;
