import {
  getAssignedComplaints,
  updateComplaintStatus,
} from "../api.js";
import { useState, useEffect } from "react";

function EmployeeDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAssignedComplaints();
      setComplaints(data);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const total = complaints.length;

  const inReview = complaints.filter(
    (c) => c.status === "In Review"
  ).length;

  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const rejected = complaints.filter(
    (c) => c.status === "Rejected"
  ).length;

  const handleStatusChange = async (
    complaintId,
    newStatus
  ) => {
    try {
      await updateComplaintStatus(
        complaintId,
        newStatus
      );

      await fetchComplaints();
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Resolved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700";
    }

    if (status === "In Progress") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen w-full bg-white">

      <div className="border-b px-8 py-4">
        <h1 className="text-center text-3xl font-semibold">
          Employee Dashboard
        </h1>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-10">

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">

              <div className="flex h-40 items-center justify-center rounded-2xl border-2">
                <p className="text-lg">
                  Total - {total}
                </p>
              </div>

              <div className="flex h-40 items-center justify-center rounded-2xl border-2">
                <p className="text-lg">
                  In Review - {inReview}
                </p>
              </div>

              <div className="flex h-40 items-center justify-center rounded-2xl border-2">
                <p className="text-lg">
                  In Progress - {inProgress}
                </p>
              </div>

              <div className="flex h-40 items-center justify-center rounded-2xl border-2">
                <p className="text-lg">
                  Resolved - {resolved}
                </p>
              </div>

              <div className="flex h-40 items-center justify-center rounded-2xl border-2">
                <p className="text-lg">
                  Rejected - {rejected}
                </p>
              </div>

            </div>

            <div className="mt-12">

              <h2 className="mb-5 text-2xl font-semibold">
                Assigned Complaints
              </h2>

              {complaints.length === 0 ? (
                <div className="rounded-xl border p-8 text-center">
                  <p>No complaints assigned to you.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border">

                  <table className="w-full border-collapse">

                    <thead>
                      <tr className="border-b bg-gray-50">

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
                          Location
                        </th>

                        <th className="px-5 py-4 text-left">
                          Status
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
                          className="border-b hover:bg-gray-50"
                        >

                          <td className="px-5 py-4">
                            {complaint.complaint_id}
                          </td>

                          <td className="px-5 py-4 font-medium">
                            {complaint.title}
                          </td>

                          <td className="px-5 py-4">
                            {complaint.category}
                          </td>

                          <td className="px-5 py-4">
                            {complaint.location || "N/A"}
                          </td>

                          <td className="px-5 py-4">

                            <select
                              value={complaint.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  complaint.complaint_id,
                                  e.target.value
                                )
                              }
                              className={`rounded-lg border px-3 py-2 outline-none ${getStatusClass(
                                complaint.status
                              )}`}
                            >

                              <option value="In Review">
                                In Review
                              </option>

                              <option value="In Progress">
                                In Progress
                              </option>

                              <option value="Resolved">
                                Resolved
                              </option>

                              <option value="Rejected">
                                Rejected
                              </option>

                            </select>

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

export default EmployeeDashboard;