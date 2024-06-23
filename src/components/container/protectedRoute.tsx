import { useCurrAccount } from "@/utils/customHook";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute: React.FC<{
  children: ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { currAccount } = useCurrAccount();
  const location = useLocation();

  return (
    <>
      {console.log()}
      {currAccount ? (
        !allowedRoles ? (
          children
        ) : allowedRoles.find((role) => role === currAccount.role) ? (
          children
        ) : (
          <Navigate
            to="/unauthorized"
            state={{ from: location }}
            replace={true}
          />
        )
      ) : (
        <Navigate to="/login" state={{ from: location }} replace={true} />
      )}
    </>
  );
};

export { ProtectedRoute };
