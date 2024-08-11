import { useCustomNavigate } from "@/hooks";
import auth from "@/utils/auth";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const PreventedRoute: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { location } = useCustomNavigate();

  return (
    <>
      {auth.getUser() ? (
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
