import { NavLink,useNavigate } from "react-router-dom"

function Sidebar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };
  return (
    <div>
      <div className="w-70 h-182 border">
        <div className="h-20 flex justify-center items-center -ml-3 border bg-cyan-500">
          <div>
            <h1>User Dashboard</h1>
          </div>
        </div>
        <div className="h-10 border -ml-5 cursor-pointer">
          <div className="h-10 justify-center items-center flex">
            <NavLink to="/home" end
            className={({ isActive }) => isActive ? "bg-black text-white px-24.5 py-2 ml-4.5" : "bg-white"}>
              Home Page</NavLink>
          </div>
        </div>
        <div className="h-10 justify-center items-center flex border -ml-5">
          <div>
            <NavLink to="/home/complaints" className={({ isActive }) => isActive ? "bg-black text-white px-22 py-2 ml-3.5" : "bg-white"}>
              My Complaints
            </NavLink>
          </div>
        </div>
        <div className="h-10 justify-center items-center flex border -ml-5">
          <div>
            <NavLink to="/home/create-complaint" className={({ isActive }) => `${isActive ? "bg-black text-white px-21 py-2 ml-3.5" : "bg-white"}`}>
              Add Complaints
            </NavLink>
          </div>
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

export default Sidebar
