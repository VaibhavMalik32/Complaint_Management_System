import { NavLink, useNavigate } from "react-router-dom";

function EmployeeSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-black w-70 h-10 justify-center items-center flex text-white"
      : "bg-stone-100 w-70 h-10 border justify-center items-center flex text-black";

  return (
    <div>
      <div className="w-70 h-182 border bg-stone-200">

        <div className="h-20 flex justify-center items-center -ml-3 border">
          <div>
            <h1>Employee Dashboard</h1>
          </div>
        </div>

        <NavLink
          to="/employee"
          end
          className={linkClass}
        >
          Home Page
        </NavLink>

        <NavLink
          to="/employee/assigned-complaints"
          end
          className={linkClass}
        >
          Assigned Complaints
        </NavLink>

        <NavLink
          to="/employee/complaint-action"
          end
          className={linkClass}
        >
          Complaint Action
        </NavLink>

        <div className="h-20 justify-center items-center flex mt-112">
          <button
            className="outline rounded-xl text-slate-700 font-semibold w-20 cursor-pointer"
            onClick={logout}
          >
            Log Out
          </button>
        </div>

      </div>
    </div>
  );
}

export default EmployeeSidebar;