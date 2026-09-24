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
      <div className="w-70 h-182 border">
        <div className="h-20 flex justify-center items-center -ml-3 border bg-cyan-500">
          <div>
            <h1>Admin Dashboard</h1>
          </div>
        </div>
        <div className="h-10 border justify-center items-center flex cursor-pointer">
          <NavLink to="/admin" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white " : "bg-white"}>
            Home Page</NavLink>
        </div>
        <div className="h-10 border justify-center items-center flex cursor-pointer">
          <NavLink to="/admin/complaints" end
            className={({ isActive }) => isActive ? "bg-black w-70 h-10 justify-center items-center flex text-white " : "bg-white"}>
            Complaints</NavLink>
        </div>
        <div className="h-20 justify-center items-center flex mt-112">
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

export default AdminSidebar
