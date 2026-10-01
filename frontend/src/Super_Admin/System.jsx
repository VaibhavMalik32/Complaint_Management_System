import { useEffect, useState } from "react";
import {
  getSuperAdminUsers,
  getSuperAdminEmployees,
  getSuperAdminAdmins,
} from "../api";

function System() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      const [userData, employeeData, adminData] = await Promise.all([
        getSuperAdminUsers(),
        getSuperAdminEmployees(),
        getSuperAdminAdmins(),
      ]);

      setUsers(userData);
      setEmployees(employeeData);
      setAdmins(adminData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getData = () => {
    if (activeTab === "users") return users;
    if (activeTab === "employees") return employees;
    return admins;
  };

  const data = getData();

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading system data...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          System
        </h1>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-3 rounded-xl ${
            activeTab === "users"
              ? "bg-gray-900 text-white"
              : "bg-white border text-gray-700"
          }`}
        >
          Users ({users.length})
        </button>

        <button
          onClick={() => setActiveTab("employees")}
          className={`px-5 py-3 rounded-xl ${
            activeTab === "employees"
              ? "bg-gray-900 text-white"
              : "bg-white border text-gray-700"
          }`}
        >
          Employees ({employees.length})
        </button>

        <button
          onClick={() => setActiveTab("admins")}
          className={`px-5 py-3 rounded-xl ${
            activeTab === "admins"
              ? "bg-gray-900 text-white"
              : "bg-white border text-gray-700"
          }`}
        >
          Admins ({admins.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  ID
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Username
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Full Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Phone
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  City
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  State
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Address
                </th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.user_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {item.user_id}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {item.username}
                    </td>

                    <td className="px-6 py-4">
                      {item.full_name}
                    </td>

                    <td className="px-6 py-4">
                      {item.email}
                    </td>

                    <td className="px-6 py-4">
                      {item.phone || "-"}
                    </td>

                    <td className="px-6 py-4">
                      {item.address || "-"}
                    </td>

                    <td className="px-6 py-4">
                      {item.city || "-"}
                    </td>

                    <td className="px-6 py-4">
                      {item.state || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default System;