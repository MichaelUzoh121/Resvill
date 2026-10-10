import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import PageLoader from "../common/PageLoader";

function StaffRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role !== ROLES.STAFF) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default StaffRoute;