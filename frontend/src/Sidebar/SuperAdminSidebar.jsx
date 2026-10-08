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
      <div className="w-70 h-182 border bg-stone-200">
        <div className="h-20 flex justify-center items-center -ml-3 border bg-stone-200">
          <div>
            <h1 className="text-black font-semibold">Super Admin Dashboard</h1>
          </div>
        </div>
        <div className="">
          <NavLink to="/super-admin" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white" : "bg-stone-100 h-10 border justify-center items-center flex"}>
            Home Page</NavLink>
        </div>
        <div className="">
          <NavLink to="/super-admin/complaints" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white" : "bg-stone-100 h-10 border justify-center items-center flex"}>
            All Complaints</NavLink>
        </div>
        <div className="">
          <NavLink to="/super-admin/add-admin" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white" : "bg-stone-100 h-10 border justify-center items-center flex"}>
            Add Admin</NavLink>
        </div>
        <div className="">
          <NavLink to="/super-admin/manage-admins" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white" : "bg-stone-100 h-10 border justify-center items-center flex"}>
            Manage Admins</NavLink>
        </div>
        <div className="">
          <NavLink to="/super-admin/system" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white" : "bg-stone-100 h-10 border justify-center items-center flex"}>
            About System</NavLink>
        </div>
        <div className="h-20 justify-center items-center flex mt-80">
          <div>
            <button className="outline rounded-xl text-slate-700 font-bold w-20 cursor-pointer" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminSidebar
