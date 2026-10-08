import {
  getSuperAdminStats,
  getSuperAdminComplaints,
} from "../api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SuperAdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsData, complaintsData] = await Promise.all([
        getSuperAdminStats(),
        getSuperAdminComplaints(),
      ]);

      console.log("Super Admin stats:", statsData);
      console.log("Super Admin complaints:", complaintsData);

      setStats(statsData || {});
      setComplaints(complaintsData || []);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <p className="text-lg text-green-800">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50 p-8">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="mb-3 text-xl font-bold text-red-700">
            Unable to load dashboard
          </h2>

          <p className="mb-6 text-gray-600">
            {error}
          </p>

          <button
            onClick={fetchDashboard}
            className="rounded-xl bg-green-800 px-6 py-3 text-white hover:bg-green-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalUsers = stats?.total_users ?? 0;
  const totalEmployees = stats?.total_employees ?? 0;
  const totalAdmins = stats?.total_admins ?? 0;
  const totalComplaints = stats?.total_complaints ?? 0;
  const inReview = stats?.in_review ?? 0;
  const inProgress = stats?.in_progress ?? 0;
  const resolved = stats?.resolved ?? 0;
  const rejected = stats?.rejected ?? 0;

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="border-b px-8 py-4">
        <h1 className="text-center text-3xl font-semibold text-black">
          Complaint Management System
        </h1>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-10 flex">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 ">

          <button
            onClick={() =>
              navigate("/super-admin/system?tab=users")
            }
            className="flex h-28 w-40 items-center justify-center rounded-2xl border-2 border-slate-300 bg-stone-200 text-lg font-medium text-gray-900"
          >
            Users - {totalUsers}
          </button>

          <button
            onClick={() =>
              navigate("/super-admin/system?tab=employees")
            }
            className="flex h-28 w-full items-center justify-center rounded-2xl border-2 border-slate-300 bg-stone-200 text-lg font-medium text-gray-900"
          >
            Employees - {totalEmployees}
          </button>

          <button
            onClick={() =>
              navigate("/super-admin/system?tab=admins")
            }
            className="flex h-28 w-full items-center justify-center rounded-2xl border-2 border-slate-300 bg-stone-200 text-lg font-medium text-gray-900 "
          >
            Admins - {totalAdmins}
          </button>

          <button
            onClick={() =>
              navigate("/super-admin/complaints")
            }
            className="flex h-28 w-full items-center justify-center rounded-2xl border-2 border-slate-300 bg-stone-200 text-lg font-medium text-gray-900 "
          >
            Complaints - {totalComplaints}
          </button>

        </div>

        <div className=" ml-20">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black">
              All Complaints
            </h2>

            <button
              onClick={() =>
                navigate("/super-admin/complaints")
              }
              className="rounded-xl border border-slate-300 px-5 py-2 text-slate-700 transition hover:bg-slate-300 hover:text-black"
            >
              View All
            </button>
          </div>

          {complaints.length === 0 ? (
            <div className="rounded-xl border bg-white p-8 text-center">
              <p>No complaints found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-slate-100">
                    <th className="px-5 py-4 text-left">
                      ID
                    </th>

                    <th className="px-5 py-4 text-left">
                      Title
                    </th>

                    <th className="px-5 py-4 text-left">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left">
                      Employee ID
                    </th>

                    <th className="px-5 py-4 text-left">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {complaints.map((complaint) => (
                    <tr
                      key={complaint.complaint_id}
                      className="border-b "
                    >
                      <td className="px-5 py-4">
                        {complaint.complaint_id}
                      </td>

                      <td className="px-5 py-4">
                        {complaint.title}
                      </td>

                      <td className="px-5 py-4">
                        {complaint.category}
                      </td>

                      <td className="px-5 py-4">
                        {complaint.status}
                      </td>

                      <td className="px-5 py-4">
                        {complaint.employee_id || "Not Assigned"}
                      </td>

                      <td className="px-5 py-4">
                        {complaint.created_at
                          ? new Date(
                              complaint.created_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;