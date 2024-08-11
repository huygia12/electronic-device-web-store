import { useCustomNavigate } from "@/hooks";
import auth from "@/utils/auth";
import { Role } from "@/utils/constants";
import { ReactNode } from "react";

const ProtectedRoute: React.FC<{
  children: ReactNode;
  allowedRoles?: Role[];
}> = ({ children, allowedRoles }) => {
  const user = auth.getUser();
  const { navigate } = useCustomNavigate();

  return (
    <>
      {user ? (
        !allowedRoles ? (
          children
        ) : allowedRoles.find((role) => role === user.role) ? (
          children
        ) : (
          <>{navigate("/unauthorized", { unstable_viewTransition: true })}</>
        )
      ) : (
        <>{navigate("/login", { unstable_viewTransition: true })}</>
      )}
    </>
  );
};

export default ProtectedRoute;
