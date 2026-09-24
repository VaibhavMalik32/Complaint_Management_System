import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminComplaint } from "../api";

function AdminComplaintDetails() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  const fetchComplaint = async () => {
    try {
      const data = await getAdminComplaint(complaintId);
      setComplaint(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
        <p className="text-gray-500">Loading complaint...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 p-8">
        <p className="text-red-500">Complaint not found.</p>
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

        {complaint.images &&
          complaint.images.length > 0 && (
            <div>
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