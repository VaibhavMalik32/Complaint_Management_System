import { Navigate, Outlet } from "react-router-dom";

function EmployeeRoute() {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role !== "employee") {
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (role === "super_admin") {
      return <Navigate to="/super-admin" replace />;
    }
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
}

export default EmployeeRoute;