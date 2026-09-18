import EmployeeSidebar from "../Sidebar/EmployeeSidebar"
import { Outlet } from "react-router-dom"

function EmployeeLayout() {
  return (
    <div className="flex">
        <EmployeeSidebar/> 
        <Outlet/>
    </div>
  )
}

export default EmployeeLayout
