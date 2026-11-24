import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RoleProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  console.log("Role Check:", {
    userRole: user?.role,
    allowedRoles,
    isAllowed: allowedRoles.includes(user?.role),
  });

  if (loading) { 
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;