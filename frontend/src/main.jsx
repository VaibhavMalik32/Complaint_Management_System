import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Layout from './Layout.jsx'
import UserDashboard from './User/UserHomePage.jsx'
import UserComplaints from './User/UserComplaints.jsx'
import Register from './Register/Register.jsx'
import Login from './Login/Login.jsx'
import AddComplaint from './User/AddComplaint.jsx'

import "./App.css"
import AdminDashboard from './Admin/AdminDashboard.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import AdminRoute from './Admin/AdminRoute.jsx'
import AdminLayout from './Admin/AdminLayout.jsx'
import SuperAdminRoute from './Super_Admin/SuperAdminRoute.jsx'
import EmployeeRoute from './Employee/EmployeeRoute.jsx'
import EmployeeLayout from './Employee/EmployeeLayout.jsx'
import SuperAdminLayout from './Super_Admin/SuperAdminLayout.jsx'
import SuperAdminDashboard from './Super_Admin/SuperAdminDashboard.jsx'
import EmployeeDashboard from './Employee/EmployeeDashboard.jsx'
import ComplaintDetails from './User/ComplaintDetails.jsx'
import UserAction from './User/UserAction.jsx'
import ComplaintAction from './Employee/ComplaintAction.jsx'
import AllComplaints from './Super_Admin/AllComplaints.jsx'
import System from './Super_Admin/System.jsx'
import AdminComplaints from './Admin/AdminComplaints.jsx'
import AdminComplaintDetails from './Admin/AdminComplaintDetails.jsx'
import AddEmployee from './Admin/AddEmployee.jsx'
import ManageEmployees from './Admin/ManageEmployees.jsx'
import AddAdmin from './Super_Admin/AddAdmin.jsx'
import ManageAdmins from './Super_Admin/ManageAdmins.jsx'
import AssignedComplaints from './Employee/AssignedComplaints.jsx'
import EmployeeComplaintDetails from "./Employee/EmployeeComplaintDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/home",
        element: <Layout />,
        children: [
          {
            path: "",
            element: <UserDashboard />,
          },
          {
            path: "complaints",
            element: <UserComplaints />,
          },
          {
            path: "create-complaint",
            element: <AddComplaint />,
          },
          {
            path: "complaints/:complaintId",
            element: <ComplaintDetails />,
          },
          {
            path: "complaints/:complaintId/action",
            element: <UserAction />,
          },
        ],
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            path: "",
            element: <AdminDashboard />,
          },
          {
            path:"complaints",
            element:<AdminComplaints/>
          },
          {
            path:"complaints/:complaintId",
            element:<AdminComplaintDetails/>
          },
          {
            path:"add-employee",
            element:<AddEmployee/>
          },
          {
            path:"manage-employee",
            element:<ManageEmployees/>
          }
        ],
      },
    ],
  },
  {
    element: <EmployeeRoute />,
    children: [
      {
        path: "/employee",
        element: <EmployeeLayout />,
        children: [
          {
            path: "",
            element: <EmployeeDashboard />,
          },
          {
            path: "assigned-complaints",
            element: <AssignedComplaints />,
          },
          {
            path: "complaint-action",
            element: <ComplaintAction />,
          },
          {
            path: "complaints/:complaintId",
            element: <EmployeeComplaintDetails />,
          },
          {
            path: "complaints/:complaintId/action",
            element: <ComplaintAction />,
          },
        ],
      },
    ],
  },
  {
    element: <SuperAdminRoute />,
    children: [
      {
        path: "/super-admin",
        element: <SuperAdminLayout />,
        children: [
          {
            path: "",
            element: <SuperAdminDashboard />,
          },
          {
            path:"complaints",
            element:<AllComplaints/>
          },
          {
            path:"system",
            element:<System/>
          },
          {
            path:"add-admin",
            element:<AddAdmin/>
          },
          {
            path:"manage-admins",
            element:<ManageAdmins/>
          }
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)