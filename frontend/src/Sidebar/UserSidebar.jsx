import { NavLink,useNavigate } from "react-router-dom"

function Sidebar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  return (
    <div>
      <div className="w-70 h-182 border bg-green-100">
        <div className="h-20 flex justify-center items-center -ml-3 border ">
          <div>
            <h1>User Dashboard</h1>
          </div>
        </div>
        <div className="">
          <NavLink to="/home" end
            className={({ isActive }) => isActive ? "bg-green-400 w-70 h-10 justify-center items-center flex text-black " : "bg-green-100 h-10 border justify-center items-center flex "}>
            Home Page</NavLink>
        </div>
        <div className="">
            <NavLink to="/home/complaints" className={({ isActive }) => isActive ? "bg-green-400 w-70 h-10 text-black justify-center items-center flex" : "bg-green-100 h-10 border justify-center items-center flex cursor-pointer"}>
              My Complaints
            </NavLink>
        </div>
        <div className="">
          <div>
            <NavLink to="/home/create-complaint" className={({ isActive }) => `${isActive ? "bg-green-400 w-70 h-10 text-black justify-center items-center flex" : "bg-green-100 h-10 border justify-center items-center flex cursor-pointer"}`}>
              Add Complaints
            </NavLink>
          </div>
        </div>
        <div className="h-20 justify-center items-center flex mt-112 bg-green-100">
          <div>
            <button className="outline rounded-xl  text-green-700 w-20 cursor-pointer font-bold" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
