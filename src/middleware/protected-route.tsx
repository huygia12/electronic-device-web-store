import { useAuth, useCustomNavigate } from "@/hooks";
import { Role } from "@/utils/constants";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{
  children: ReactNode;
  allowedRoles?: Role[];
}> = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  const { location } = useCustomNavigate();

  console.log("to location: ", location.pathname);
  return (
    <>
      {currentUser ? (
        !allowedRoles ? (
          children
        ) : allowedRoles.find((role) => role === currentUser.role) ? (
          children
        ) : (
          <Navigate
            to="/unauthorized"
            state={{ unstable_useViewTransitionState: true }}
            replace={true}
          />
        )
      ) : (
        <Navigate
          to="/login"
          state={{ unstable_useViewTransitionState: true }}
          replace={true}
        />
      )}
    </>
  );
};

export default ProtectedRoute;
