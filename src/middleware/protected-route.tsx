import auth from "@/utils/auth";
import { Role } from "@/utils/constants";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{
  children: ReactNode;
  allowedRoles?: Role[];
}> = ({ children, allowedRoles }) => {
  const user = auth.getUser();

  return (
    <>
      {user ? (
        !allowedRoles ? (
          children
        ) : allowedRoles.find((role) => role === user.role) ? (
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
