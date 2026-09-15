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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/home",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <UserDashboard />
      },
      {
        path: "complaints",
        element: <UserComplaints />
      },
      {
        path:"create-complaint",
        element: <AddComplaint />
      }
    ]
  },
  {
    path:"/admin",
    element:<AdminDashboard/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)