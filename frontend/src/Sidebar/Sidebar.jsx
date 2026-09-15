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
          <div className="justify-center items-center flex">
            <NavLink to="/"
            className={({ isActive }) => 
                `block px-2 py-1.5 
                ${isActive ? "bg-white" : "bg-white"}`}
            >Home Page</NavLink>
          </div>
        </div>
        <div className="h-10 justify-center items-center flex border -ml-5">
          <div>
            <NavLink to="/home/complaints" className={({ isActive }) => isActive ? "bg-white" : "bg-white"}>
              My Complaints
            </NavLink>
          </div>
        </div>
        <div className="h-10 justify-center items-center flex border -ml-5">
          <div>
            <NavLink to="/home/create-complaint" className={({ isActive }) => isActive ? "bg-white" : "bg-white"}>
              Add Complaints
            </NavLink>
          </div>
        </div>
        <div className="h-20 justify-center items-center flex mt-112 border bg-blue-200">
          <div>
            <button className="outline rounded-xl bg-red-500 w-20 cursor-pointer" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
