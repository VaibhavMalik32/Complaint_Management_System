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
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [statsData, complaintsData] = await Promise.all([
        getSuperAdminStats(),
        getSuperAdminComplaints(),
      ]);
      console.log("Super Admin complaints:", complaintsData);
      setStats(statsData);
      setComplaints(complaintsData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen w-full bg-green-50">
      <div className="border-b px-8 py-4">
        <h1 className="text-center text-3xl font-semibold text-green-700">
          Complaint Management System
        </h1>
      </div>
      <div className="mx-auto max-w-7xl px-8 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 ml-20 gap-60">
              <div className="flex h-25 w-50 items-center justify-center rounded-2xl border-2 bg-green-200">
                <p className="text-lg">
                  Users - {stats.total_users}
                </p>
              </div>
              <div className="flex h-25 w-50 items-center justify-center rounded-2xl border-2 bg-green-200">
                <p className="text-lg">
                  Employees - {stats.total_employees}
                </p>
              </div>
              <div className="flex h-25 w-50 items-center justify-center rounded-2xl border-2 bg-green-200">
                <p className="text-lg">
                  Admins - {stats.total_admins}
                </p>
              </div>
              <div className="flex h-25 w-50 items-center justify-center rounded-2xl border-2 bg-green-200">
                <p className="text-lg">
                  Complaints - {stats.total_complaints}
                </p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 ml-20 gap-60">
              <div className="flex h-25 w-50 items-center justify-center rounded-2xl border-2 bg-green-200">
                <p>
                  In Review - {stats.in_review}
                </p>
              </div>
              <div className="flex h-25 w-50 items-center justify-center rounded-2xl border-2 bg-green-200">
                <p>
                  In Progress - {stats.in_progress}
                </p>
              </div>
              <div className="flex h-25 w-50 items-center justify-center rounded-2xl border-2 bg-green-200">
                <p>
                  Resolved - {stats.resolved}
                </p>
              </div>
              <div className="flex h-25 w-50 items-center justify-center rounded-2xl border-2 bg-green-200">
                <p>
                  Rejected - {stats.rejected}
                </p>
              </div>
            </div>
            <div className="mt-12">
              <h2 className="mb-5 text-2xl font-bold text-green-700">
                All Complaints
              </h2>
              {complaints.length === 0 ? (
                <div className="rounded-xl border p-8 text-center">
                  <p>No complaints found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border ">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-green-200">
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
                          className=""
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
          </>
        )}
      </div>
    </div>
  );
}

export default SuperAdminDashboard;