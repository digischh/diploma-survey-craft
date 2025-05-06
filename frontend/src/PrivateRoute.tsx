import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

type TPrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute: FC<TPrivateRouteProps> = ({ children }) => {
  const userID = sessionStorage.getItem("userID");

  if (!userID) {
    return <Navigate to={"/signin"} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
