import { Outlet } from "react-router-dom"
import SuperAdminSidebar from "../Sidebar/SuperAdminSidebar"

function SuperAdminLayout() {
  return (
    <div className="flex">
      <SuperAdminSidebar/>
      <Outlet/>
    </div>
  )
}

export default SuperAdminLayout
