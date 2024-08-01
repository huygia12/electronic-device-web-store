import { useCurrentUser } from "@/hooks";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute: React.FC<{
  children: ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { currUser } = useCurrentUser();
  const location = useLocation();

  return (
    <>
      {console.log()}
      {currUser ? (
        !allowedRoles ? (
          children
        ) : allowedRoles.find((role) => role === currUser.role) ? (
          children
        ) : (
          <Navigate
            to="/unauthorized"
            state={{ from: location, unstable_useViewTransitionState: true }}
            replace={true}
          />
        )
      ) : (
        <Navigate
          to="/login"
          state={{ from: location, unstable_useViewTransitionState: true }}
          replace={true}
        />
      )}
    </>
  );
};

export default ProtectedRoute;
