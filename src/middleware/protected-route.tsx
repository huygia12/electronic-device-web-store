import useCurrentUser from "@/hooks/use-current-user";
import { Role } from "@/utils/constants";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{
  children: ReactNode;
  allowedRoles?: Role[];
}> = ({ children, allowedRoles = [Role.ADMIN, Role.CLIENT] }) => {
  const { currentUser } = useCurrentUser();

  return (
    <>
      {currentUser !== undefined &&
        (currentUser ? (
          allowedRoles.find((role) => role === currentUser.role) ? (
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
        ))}
    </>
  );
};

export default ProtectedRoute;
