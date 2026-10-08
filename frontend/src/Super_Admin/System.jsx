import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getSuperAdminUsers,
  getSuperAdminEmployees,
  getSuperAdminAdmins,
} from "../api";

function System() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.get("tab") || "users";

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);

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

  const changeTab = (tab) => {
    setSearchParams({ tab });
  };

  const getData = () => {
    if (activeTab === "users") return users;
    if (activeTab === "employees") return employees;
    if (activeTab === "admins") return admins;
    return users;
  };

  const data = getData();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-green-800">
          Loading system data...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-slate-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">
          System
        </h1>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          onClick={() => changeTab("users")}
          className={`rounded-xl px-5 py-3 ${
            activeTab === "users"
              ? "bg-stone-500 text-white"
              : "border bg-slate-100 text-slate-700"
          }`}
        >
          Users ({users.length})
        </button>

        <button
          onClick={() => changeTab("employees")}
          className={`rounded-xl px-5 py-3 ${
            activeTab === "employees"
              ? "bg-stone-500 text-white"
              : "border bg-slate-100 text-slate-700"
          }`}
        >
          Employees ({employees.length})
        </button>

        <button
          onClick={() => changeTab("admins")}
          className={`rounded-xl px-5 py-3 ${
            activeTab === "admins"
              ? "bg-stone-500 text-white"
              : "border bg-slate-100 text-slate-700"
          }`}
        >
          Admins ({admins.length})
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
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
                    className="border-t bg-slate-50"
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
                      {item.city || "-"}
                    </td>

                    <td className="px-6 py-4">
                      {item.state || "-"}
                    </td>

                    <td className="px-6 py-4">
                      {item.address || "-"}
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