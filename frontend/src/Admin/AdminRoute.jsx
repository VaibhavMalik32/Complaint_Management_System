import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role !== "admin") {
    if (role === "super_admin") {
      return <Navigate to="/super-admin" replace />;
    }
    if (role === "employee") {
      return <Navigate to="/employee" replace />;
    }
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
}

export default AdminRoute;