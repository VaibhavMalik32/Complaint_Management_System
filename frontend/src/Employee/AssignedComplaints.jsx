import {
  getAssignedComplaints,
  updateComplaintStatus,
} from "../api.js";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AssignedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const statusFilter = searchParams.get("status");

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

  const filteredComplaints = statusFilter
    ? complaints.filter(
        (complaint) =>
          complaint.status === statusFilter
      )
    : complaints;

  return (
    <div className="min-h-screen w-full bg-white">

      <div className="mx-auto max-w-7xl px-8 py-12">

        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-black">
            Assigned Complaints
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <p>Loading complaints...</p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap gap-4">

              <button
                onClick={() =>
                  navigate(
                    "/employee/assigned-complaints"
                  )
                }
                className={`rounded-2xl border border-slate-700 px-6 py-4 text-lg ${
                  !statusFilter
                    ? "bg-stone-500 text-white"
                    : "bg-slate-50 text-slate-800 hover:bg-slate-100"
                }`}
              >
                All ({total})
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/employee/assigned-complaints?status=In%20Review"
                  )
                }
                className={`rounded-2xl border border-slate-700 px-6 py-4 text-lg ${
                  statusFilter === "In Review"
                    ? "bg-stone-500 text-white"
                    : "bg-slate-50 text-slate-800 hover:bg-slate-100"
                }`}
              >
                In Review ({inReview})
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/employee/assigned-complaints?status=In%20Progress"
                  )
                }
                className={`rounded-2xl border border-slate-700 px-6 py-4 text-lg ${
                  statusFilter === "In Progress"
                    ? "bg-stone-500 text-white"
                    : "bg-slate-50 text-slate-800 hover:bg-slate-100"
                }`}
              >
                In Progress ({inProgress})
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/employee/assigned-complaints?status=Resolved"
                  )
                }
                className={`rounded-2xl border border-slate-700 px-6 py-4 text-lg ${
                  statusFilter === "Resolved"
                    ? "bg-stone-500 text-white"
                    : "bg-slate-50 text-slate-800 hover:bg-slate-100"
                }`}
              >
                Resolved ({resolved})
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/employee/assigned-complaints?status=Rejected"
                  )
                }
                className={`rounded-2xl border border-slate-700 px-6 py-4 text-lg ${
                  statusFilter === "Rejected"
                    ? "bg-stone-500 text-white"
                    : "bg-slate-50 text-slate-800 hover:bg-slate-100"
                }`}
              >
                Rejected ({rejected})
              </button>

            </div>

            {filteredComplaints.length === 0 ? (
              <div className="rounded-2xl border border-black bg-slate-100 px-6 py-12 text-center text-gray-500">
                {statusFilter
                  ? `No ${statusFilter} complaints assigned to you.`
                  : "No complaints assigned to you."}
              </div>
            ) : (
              <div className="space-y-6">

                {filteredComplaints.map((complaint) => (
                  <div
                    key={complaint.complaint_id}
                    className="rounded-2xl border border-black bg-slate-100 px-7 py-7"
                  >

                    <div className="flex items-start justify-between gap-6">

                      <div className="flex-1">

                        <div className="mb-6 flex flex-wrap items-center gap-3">

                          <span className="text-2xl font-bold text-black">
                            Title -
                          </span>

                          <span className="text-xl text-slate-800">
                            {complaint.title}
                          </span>

                          <span
                            className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusClass(
                              complaint.status
                            )}`}
                          >
                            {complaint.status}
                          </span>

                        </div>

                        <div className="mb-6">

                          <p className="text-2xl font-bold text-black">
                            Description -
                          </p>

                          <p className="mt-2 text-lg text-black">
                            {complaint.description}
                          </p>

                        </div>

                        <div className="mb-6 flex gap-4">

                          <p className="text-2xl font-bold text-black">
                            Complaint Location -
                          </p>

                          <p className="flex-1 text-lg text-slate-700">
                            {complaint.location || "N/A"}
                          </p>

                        </div>

                        <div>

                          <p className="text-xl text-black">
                            <span className="font-bold">
                              Assigned to -
                            </span>{" "}
                            You
                          </p>

                        </div>

                      </div>

                      <div className="shrink-0 rounded-full bg-slate-800 px-6 py-3 text-base font-semibold text-white">
                        {complaint.category}
                      </div>

                    </div>

                    <div className="mt-12 flex items-end justify-between">

                      <p className="text-base text-slate-700">
                        Submitted on{" "}
                        {complaint.created_at
                          ? new Date(
                              complaint.created_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>

                      <div className="flex gap-4">

                        <button
                          onClick={() =>
                            navigate(
                              `/employee/complaints/${complaint.complaint_id}`
                            )
                          }
                          className="rounded-2xl border border-black bg-transparent px-7 py-4 text-lg font-medium text-black hover:bg-white"
                        >
                          View
                        </button>

                        <select
                          value={complaint.status}
                          onChange={(e) =>
                            handleStatusChange(
                              complaint.complaint_id,
                              e.target.value
                            )
                          }
                          className={`rounded-2xl border border-black px-5 py-4 text-lg outline-none ${getStatusClass(
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

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default AssignedComplaints;