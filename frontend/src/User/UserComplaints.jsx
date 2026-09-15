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
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "In Review":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              My Complaints
            </h1>

            <p className="mt-2 text-slate-500">
              Track the complaints you have submitted.
            </p>
          </div>

          <button
            onClick={() => navigate("/home/create-complaint")}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            + Add Complaint
          </button>

        </div>


        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}


        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">

            <p className="text-slate-500">
              Loading your complaints...
            </p>

          </div>
        )}


        {/* Empty */}
        {!loading && complaints.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <span className="text-2xl">
                📋
              </span>
            </div>

            <h2 className="text-xl font-semibold text-slate-800">
              No Complaints Yet
            </h2>

            <p className="mt-2 text-slate-500">
              You haven't submitted any complaints.
            </p>

            <button
              onClick={() => navigate("/home/create-complaint")}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Submit Your First Complaint
            </button>

          </div>
        )}


        {/* Complaints */}
        {!loading && complaints.length > 0 && (

          <div className="space-y-5">

            {complaints.map((complaint) => (

              <div
                key={complaint.complaint_id}
                className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >

                {/* Top */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-xl font-bold text-slate-800">
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

                    <p className="mt-2 text-sm text-slate-400">
                      Complaint #{complaint.complaint_id}
                    </p>

                  </div>

                  <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    {complaint.category}
                  </span>

                </div>


                {/* Description */}
                <div className="mt-5">

                  <p className="text-sm leading-7 text-slate-600">
                    {complaint.description}
                  </p>

                </div>


                {/* Bottom */}
                <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">

                  <div className="text-sm text-slate-400">

                    Submitted on{" "}

                    {complaint.created_at
                      ? new Date(
                          complaint.created_at
                        ).toLocaleDateString()
                      : "N/A"}

                  </div>


                  <button
                    onClick={() =>
                      handleDelete(
                        complaint.complaint_id
                      )
                    }
                    className="w-fit rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>

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