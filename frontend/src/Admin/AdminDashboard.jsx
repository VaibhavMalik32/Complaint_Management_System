import {
  getAllComplaints,
  updateComplaintStatus,
  getMatchingEmployees,
  assignComplaint,
} from "../api.js";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);
  const [error, setError] = useState("");
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await getAllComplaints();
      setComplaints(data);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchEmployees = async () => {
    try {
      const data = await getMatchingEmployees();

      setEmployees(data);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };
  useEffect(() => {
    fetchComplaints();
    fetchEmployees();
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
  const handleEmployeeChange = (
    complaintId,
    employeeId
  ) => {
    setSelectedEmployees({
      ...selectedEmployees,
      [complaintId]: employeeId,
    });
  };
  const handleAssign = async (complaintId) => {
    const employeeId = selectedEmployees[complaintId];
    if (!employeeId) {
      setError("Please select an employee first.");
      return;
    }
    try {
      setError("");
      setAssigning(complaintId);
      await assignComplaint(
        complaintId,
        Number(employeeId)
      );
      await fetchComplaints();
      setSelectedEmployees((prev) => {
        const updated = { ...prev };
        delete updated[complaintId];
        return updated;
      });
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setAssigning(null);
    }
  };
  return (
    <div className="min-h-screen w-full bg-green-50">
      <div className="border-b px-8 py-4">
        <h1 className="text-center text-3xl font-semibold text-green-800">
          Admin Dashboard
        </h1>
      </div>
      <div className="mx-auto max-w-7xl px-8 py-10">
        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-600">
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
              <div className="flex h-40 items-center justify-center rounded-2xl border-2 bg-green-100">
                <p className="text-lg">
                  Total - {total}
                </p>
              </div>
              <div className="flex h-40 items-center justify-center rounded-2xl border-2 bg-green-100">
                <p className="text-lg">
                  In Review - {inReview}
                </p>
              </div>
              <div className="flex h-40 items-center justify-center rounded-2xl border-2 bg-green-100">
                <p className="text-lg">
                  In Progress - {inProgress}
                </p>
              </div>
              <div className="flex h-40 items-center justify-center rounded-2xl border-2 bg-green-100">
                <p className="text-lg">
                  Resolved - {resolved}
                </p>
              </div>
              <div className="flex h-40 items-center justify-center rounded-2xl border-2 bg-green-100">
                <p className="text-lg">
                  Rejected - {rejected}
                </p>
              </div>
            </div>
            <div className="mt-12">
              <h2 className="mb-5 text-2xl font-semibold text-green-800">
                Complaints
              </h2>
              {complaints.length === 0 ? (
                <div className="rounded-xl border p-8 text-center">
                  <p>No complaints found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border">
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
                          Employee
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
                          className="border-b"
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
                            <select
                              value={complaint.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  complaint.complaint_id,
                                  e.target.value
                                )
                              }
                              className="rounded-lg border px-3 py-2 outline-none"
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
                            <div className="flex items-center gap-2">
                              <select
                                value={
                                  selectedEmployees[
                                    complaint.complaint_id
                                  ] ||
                                  complaint.employee_id ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleEmployeeChange(
                                    complaint.complaint_id,
                                    e.target.value
                                  )
                                }
                                className="rounded-lg border px-3 py-2 outline-none"
                              >
                                <option value="">
                                  Select Employee
                                </option>
                                {employees.map(
                                  (employee) => (
                                    <option
                                      key={employee.user_id}
                                      value={employee.user_id}
                                    >
                                      {employee.full_name}
                                    </option>
                                  )
                                )}
                              </select>
                              <button
                                onClick={() =>
                                  handleAssign(
                                    complaint.complaint_id
                                  )
                                }
                                disabled={
                                  assigning ===
                                  complaint.complaint_id
                                }
                                className="rounded-lg border px-4 py-2 hover:bg-black hover:text-white disabled:opacity-50"
                              >
                                {assigning ===
                                complaint.complaint_id
                                  ? "Assigning..."
                                  : "Assign"}

                              </button>
                            </div>
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

export default AdminDashboard;