import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import PageLoader from "../common/PageLoader";

function DriverRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role !== ROLES.DELIVERY) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default DriverRoute;