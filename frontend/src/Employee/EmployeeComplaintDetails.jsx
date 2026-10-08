import { useEffect, useState } from "react";
import { getAssignedComplaints } from "../api.js";
import { useNavigate, useParams } from "react-router-dom";

function EmployeeComplaintDetails() {
  const { complaintId } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAssignedComplaints();

        const foundComplaint = data.find(
          (item) =>
            String(item.complaint_id) === String(complaintId)
        );

        if (!foundComplaint) {
          setError("Complaint not found.");
          return;
        }

        setComplaint(foundComplaint);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [complaintId]);

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
      <div className="min-h-screen bg-white p-8">
        <p>Loading complaint...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto max-w-5xl px-8 py-12">

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-black">
            Complaint Details
          </h1>

          <button
            onClick={() =>
              navigate("/employee/assigned-complaints")
            }
            className="rounded-xl border border-black px-5 py-3 hover:bg-gray-100"
          >
            Back
          </button>
        </div>

        <div className="rounded-2xl border border-black bg-slate-100 p-8">

          <div className="mb-8 flex items-start justify-between gap-6">
            <div>
              <p className="mb-2 text-sm text-gray-500">
                Complaint ID
              </p>

              <p className="text-xl font-semibold">
                #{complaint.complaint_id}
              </p>
            </div>

            <span
              className={`rounded-full px-5 py-2 text-sm font-medium ${getStatusClass(
                complaint.status
              )}`}
            >
              {complaint.status}
            </span>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm text-gray-500">
              Title
            </p>

            <p className="text-2xl font-semibold">
              {complaint.title}
            </p>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm text-gray-500">
              Category
            </p>

            <span className="inline-block rounded-full bg-slate-800 px-5 py-2 text-sm font-semibold text-white">
              {complaint.category}
            </span>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm text-gray-500">
              Description
            </p>

            <p className="text-lg leading-7 text-gray-800">
              {complaint.description}
            </p>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm text-gray-500">
              Complaint Location
            </p>

            <p className="text-lg text-gray-800">
              {complaint.location || "N/A"}
            </p>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm text-gray-500">
              Submitted On
            </p>

            <p className="text-lg text-gray-800">
              {complaint.created_at
                ? new Date(
                    complaint.created_at
                  ).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() =>
                navigate(
                  `/employee/complaints/${complaint.complaint_id}/action`
                )
              }
              className="rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
            >
              Take Action
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EmployeeComplaintDetails;