import { Navigate, Outlet } from "react-router-dom";

function SuperAdminRoute() {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role !== "super_admin") {
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (role === "employee") {
      return <Navigate to="/employee" replace />;
    }
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
}

export default SuperAdminRoute;