import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getAdminComplaint,
  getMatchingEmployees,
  assignComplaint,
  updateComplaintStatus,
} from "../api";

function AdminComplaintDetails() {
  const { complaintId } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminComplaint(complaintId);

      setComplaint(data);
      setSelectedStatus(data.status);

      if (!data.employee_id) {
        fetchEmployees();
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true);

      const data = await getMatchingEmployees();

      setEmployees(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setEmployeesLoading(false);
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployee) {
      setError("Please select an employee.");
      return;
    }

    try {
      setAssigning(true);
      setError("");
      setSuccess("");

      const updatedComplaint = await assignComplaint(
        complaintId,
        Number(selectedEmployee)
      );

      setComplaint(updatedComplaint);

      setSuccess("Complaint assigned successfully.");
      setSelectedEmployee("");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");
      setSuccess("");

      const updatedComplaint = await updateComplaintStatus(
        complaintId,
        selectedStatus
      );

      setComplaint(updatedComplaint);

      setSuccess("Complaint status updated successfully.");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setUpdatingStatus(false);
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

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 p-8">
        <p className="text-gray-500">
          Loading complaint...
        </p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 p-8">
        <p className="text-red-500">
          {error || "Complaint not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50 p-8">

      <button
        onClick={() => navigate("/admin/complaints")}
        className="mb-6 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
      >
        ← Back
      </button>

      {error && (
        <div className="mb-6 max-w-4xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 max-w-4xl rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {success}
        </div>
      )}

      <div className="max-w-4xl bg-white rounded-2xl border shadow-sm p-8">

        <div className="flex justify-between items-start mb-8">

          <div>
            <p className="text-sm text-gray-500">
              Complaint #{complaint.complaint_id}
            </p>

            <h1 className="text-3xl font-bold text-gray-800 mt-1">
              {complaint.title}
            </h1>
          </div>

          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(
              complaint.status
            )}`}
          >
            {complaint.status}
          </span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div>
            <p className="text-sm text-gray-500">
              Complaint ID
            </p>

            <p className="font-medium text-gray-800 mt-1">
              #{complaint.complaint_id}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              User ID
            </p>

            <p className="font-medium text-gray-800 mt-1">
              #{complaint.user_id}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Category
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {complaint.category}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Complaint Location
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {complaint.location || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Assigned Employee
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {complaint.employee_id
                ? `Employee #${complaint.employee_id}`
                : "Not Assigned"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Submitted
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {complaint.created_at
                ? new Date(
                    complaint.created_at
                  ).toLocaleString()
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Last Updated
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {complaint.updated_at
                ? new Date(
                    complaint.updated_at
                  ).toLocaleString()
                : "-"}
            </p>
          </div>

        </div>

        <div className="mb-8">

          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Complaint Description
          </h2>

          <div className="bg-gray-50 rounded-xl p-5 text-gray-700">
            {complaint.description}
          </div>

        </div>

        {!complaint.employee_id && (
          <div className="mb-8 border-t pt-8">

            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Assign Employee
            </h2>

            {employeesLoading ? (
              <p className="text-gray-500">
                Loading available employees...
              </p>
            ) : employees.length === 0 ? (
              <p className="text-gray-500">
                No matching employees available.
              </p>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row">

                <select
                  value={selectedEmployee}
                  onChange={(e) =>
                    setSelectedEmployee(e.target.value)
                  }
                  className="flex-1 rounded-xl border px-4 py-3 outline-none"
                >
                  <option value="">
                    Select Employee
                  </option>

                  {employees.map((employee) => (
                    <option
                      key={employee.user_id}
                      value={employee.user_id}
                    >
                      {employee.full_name} -{" "}
                      {employee.post}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAssignEmployee}
                  disabled={assigning}
                  className="rounded-xl bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
                >
                  {assigning
                    ? "Assigning..."
                    : "Assign Employee"}
                </button>

              </div>
            )}

          </div>
        )}

        <div className="mb-8 border-t pt-8">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Update Status
          </h2>

          <div className="flex flex-col gap-4 sm:flex-row">

            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value)
              }
              className="flex-1 rounded-xl border px-4 py-3 outline-none"
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

            <button
              onClick={handleStatusUpdate}
              disabled={
                updatingStatus ||
                selectedStatus === complaint.status
              }
              className="rounded-xl bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updatingStatus
                ? "Updating..."
                : "Update Status"}
            </button>

          </div>

        </div>

        {complaint.images &&
          complaint.images.length > 0 && (
            <div className="border-t pt-8">

              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Evidence Submitted By User
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {complaint.images.map((image) => (
                  <img
                    key={image.image_id}
                    src={`${import.meta.env.VITE_BACKEND_URL}${image.image_path}`}
                    alt="User complaint evidence"
                    className="w-full h-64 object-cover rounded-xl border"
                  />
                ))}

              </div>

            </div>
          )}

      </div>
    </div>
  );
}

export default AdminComplaintDetails;