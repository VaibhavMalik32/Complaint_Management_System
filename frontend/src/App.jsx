import "./App.css"
import UserDashboard from "./User/UserHomePage.jsx"
import Sidebar from "./Sidebar/Sidebar.jsx"
import Outlet from "react-router-dom"

function App(){
  return(
    <div>
      <Sidebar/>
      <Outlet/>
    </div>
  )
}
export default App