import AdminSidebar from "../Sidebar/AdminSidebar"
import { Outlet } from "react-router-dom"

function AdminLayout() {
  return (
    <div className="flex">
        <AdminSidebar /> 
        <Outlet/>
    </div>
  )
}

export default AdminLayout
