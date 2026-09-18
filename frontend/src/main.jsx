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