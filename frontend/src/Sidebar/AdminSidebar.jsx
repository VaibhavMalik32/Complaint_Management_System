import { NavLink,useNavigate } from "react-router-dom"

function AdminSidebar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  return (
    <div>
      <div className="w-70 h-182 border bg-stone-200">
        <div className="h-20 flex justify-center items-center -ml-3 border">
          <div>
            <h1>Admin Dashboard</h1>
          </div>
        </div>
        <div className="">
          <NavLink to="/admin" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white" : "bg-stone-100 h-10 border justify-center items-center flex"}>
            Home Page</NavLink>
        </div>
        <div className="">
          <NavLink to="/admin/complaints" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white" : "bg-stone-100 h-10 border justify-center items-center flex"}>
            Complaints</NavLink>
        </div>
        <div className="">
          <NavLink to="/admin/add-employee" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white" : "bg-stone-100 h-10 border justify-center items-center flex"}>
            Add Employee</NavLink>
        </div>
        <div className="">
          <NavLink to="/admin/manage-employee" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white" : "bg-stone-100 h-10 border justify-center items-center flex"}>
            Manage Employee</NavLink>
        </div>
        <div className="h-20 justify-center items-center flex mt-90">
          <div>
            <button className="outline rounded-xl text-slate-600 w-20 cursor-pointer font-semibold" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar
