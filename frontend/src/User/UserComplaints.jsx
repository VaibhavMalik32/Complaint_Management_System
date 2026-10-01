import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyComplaints,
  deleteComplaint,
} from "../api.js";

function UserComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComplaints();
  }, []); 

  const handleDelete = async (complaintId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );
    if (!confirmed) {
      return;
    }
    try {
      await deleteComplaint(complaintId);
      setComplaints((prev) =>
        prev.filter(
          (complaint) =>
            complaint.complaint_id !== complaintId
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "In Review":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6 md:p-10">
      <div className="mx-auto w-full max-w-5xl">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Complaints
            </h1>
          </div>

          <button
            onClick={() => navigate("/home/create-complaint")}
            className="rounded-xl bg-black px-5 py-3 font-semibold text-white"
          >
            + Add Complaint
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              Loading your complaints...
            </p>
          </div>
        )}

        {!loading && complaints.length === 0 && (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm md:p-14">
            <h2 className="text-xl font-semibold text-gray-800">
              No Complaints Yet
            </h2>

            <button
              onClick={() =>
                navigate("/home/create-complaint")
              }
              className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white cursor-pointer"
            >
              Submit Complaint
            </button>
          </div>
        )}

        {!loading && complaints.length > 0 && (
          <div className="space-y-5">
            {complaints.map((complaint) => (
              <div
                key={complaint.complaint_id}
                className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
              >

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="text-xl font-bold">
                        Title -
                      </label>

                      <h2 className="text-s text-gray-800">
                        {complaint.title}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          complaint.status
                        )}`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-gray-800 px-4 py-1.5 text-sm font-medium text-white">
                    {complaint.category}
                  </span>

                </div>

                <div className="mt-4">
                  <label className="font-bold text-xl">
                    Description -
                  </label>

                  <p className="leading-7">
                    {complaint.description}
                  </p>
                </div>

                <div className="mt-4 flex">
                  <label className="font-bold text-xl">
                    Complaint Location -
                  </label>
                  <p className="mt-1 ml-1 text-gray-700">
                    {complaint.location || "N/A"}
                  </p>
                </div>
                <br />
                <div className="flex">
                  <h1 className="font-bold text-xl">Assigned to -</h1>
                  <p className="mt-1 ml-1">{complaint.employee_name || "Not Assigned"}</p>
                </div>
                <div className="mt-6 flex flex-col justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">

                  <p className="text-sm">
                    Submitted on{" "}
                    {complaint.created_at
                      ? new Date(
                          complaint.created_at
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <div className="flex gap-3">

                    {complaint.status === "Resolved" && (
                      <button
                        onClick={() =>
                          navigate(
                            `/home/complaints/${complaint.complaint_id}/action`
                          )
                        }
                        className="rounded-xl border border-green-600 px-5 py-3 font-medium text-green-600"
                      >
                        Action
                      </button>
                    )}

                    <button
                      onClick={() =>
                        navigate(
                          `/home/complaints/${complaint.complaint_id}`
                        )
                      }
                      className="rounded-xl border px-5 py-3 font-medium text-black cursor-pointer"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(complaint.complaint_id)
                      }
                      className="rounded-xl border border-red-500 px-5 py-3 font-medium text-red-600"
                    >
                      Delete
                    </button>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default UserComplaints;