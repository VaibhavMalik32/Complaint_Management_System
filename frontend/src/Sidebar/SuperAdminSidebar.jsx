import { NavLink,useNavigate } from "react-router-dom"

function SuperAdminSidebar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  return (
    <div>
      <div className="w-70 h-182 border">
        <div className="h-20 flex justify-center items-center -ml-3 border bg-cyan-500">
          <div>
            <h1>Super Admin Dashboard</h1>
          </div>
        </div>
        <div className="h-10 border justify-center items-center flex cursor-pointer">
          <NavLink to="/super-admin" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white " : "bg-white"}>
            Home Page</NavLink>
        </div>
        <div className="h-10 border justify-center items-center flex cursor-pointer">
          <NavLink to="/super-admin/complaints" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white " : "bg-white"}>
            All Complaints</NavLink>
        </div>
        <div className="h-10 border justify-center items-center flex cursor-pointer">
          <NavLink to="/super-admin/add-admin" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white " : "bg-white"}>
            Add Admin</NavLink>
        </div>
        <div className="h-10 border justify-center items-center flex cursor-pointer">
          <NavLink to="/super-admin/manage-admins" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white " : "bg-white"}>
            Manage Admins</NavLink>
        </div>
        <div className="h-10 border justify-center items-center flex cursor-pointer">
          <NavLink to="/super-admin/system" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white " : "bg-white"}>
            About System</NavLink>
        </div>
        <div className="h-20 justify-center items-center flex mt-80">
          <div>
            <button className="outline rounded-xl text-red-600 w-20 cursor-pointer" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminSidebar
