import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import "./App.css"
import Layout from "./components/Layout";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Complaints from "./pages/Complaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import Management from "./pages/Management";
import Organizations from "./pages/Organizations";
import Departments from "./pages/Departments";
import Categories from "./pages/Categories";
import Staff from "./pages/Staff";


export default function App() {

    return (

        <BrowserRouter>

            <Sidebar />

            <div className="ml-64 min-h-screen">

                <Header />

                <Routes>


                    <Route
                        path="/complaints"
                        element={<Complaints />}
                    />

                    <Route
                        path="/complaints/:id"
                        element={<ComplaintDetails />}
                    />

                    <Route
                        path="/management"
                        element={<Management />}
                    />

                    <Route
                        path="/organizations"
                        element={<Organizations />}
                    />

                    <Route
                        path="/departments"
                        element={<Departments />}
                    />

                    <Route
                        path="/categories"
                        element={<Categories />}
                    />

                    <Route
                        path="/staff"
                        element={<Staff />}
                    />

                    <Route
                      path="/"
                      element={
                        <Layout role="user">
                          <UserDashboard/>
                        </Layout>
                      }
                    />

                    <Route
                        path="/user/complaints"
                        element={
                            <Layout role="user">
                                <Complaints />
                            </Layout>
                        }
                    />

                    <Route
                        path="/user/complaints/:id"
                        element={
                            <Layout role="user">
                                <ComplaintDetails />
                            </Layout>
                        }
                    />

                    <Route
                      path="/admin"
                      element={
                        <Layout role="admin">
                          <AdminDashboard/>
                        </Layout>
                      }
                    />


                </Routes>

            </div>

        </BrowserRouter>
    );
}