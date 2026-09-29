import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  if (role === "employee") {
    return <Navigate to="/employee" replace />;
  }
  if (role === "super_admin") {
    return <Navigate to="/super-admin" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;