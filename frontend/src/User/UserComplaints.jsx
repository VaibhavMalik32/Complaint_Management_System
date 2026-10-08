import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getMyComplaints,
  deleteComplaint,
} from "../api.js";

function UserComplaints() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activeTab = searchParams.get("status") || "all";

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

  const changeTab = (status) => {
    setSearchParams({ status });
  };

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

  const filteredComplaints =
    activeTab === "all"
      ? complaints
      : complaints.filter(
          (complaint) => complaint.status === activeTab
        );

  return (
    <div className="min-h-screen w-full bg-stone-50 p-6 md:p-10">
      <div className="mx-auto w-full max-w-5xl">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold text-black">
            My Complaints
          </h1>

          <button
            onClick={() => navigate("/home/create-complaint")}
            className="rounded-xl bg-stone-400 px-5 py-3 font-semibold text-black"
          >
            + Add Complaint
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => changeTab("all")}
            className={`rounded-xl px-5 py-3 ${
              activeTab === "all"
                ? "bg-stone-500 text-white"
                : "border bg-slate-100 text-slate-700"
            }`}
          >
            All ({complaints.length})
          </button>

          <button
            onClick={() => changeTab("In Review")}
            className={`rounded-xl px-5 py-3 ${
              activeTab === "In Review"
                ? "bg-stone-500 text-white"
                : "border bg-slate-100 text-slate-700"
            }`}
          >
            In Review (
            {
              complaints.filter(
                (complaint) =>
                  complaint.status === "In Review"
              ).length
            }
            )
          </button>

          <button
            onClick={() => changeTab("In Progress")}
            className={`rounded-xl px-5 py-3 ${
              activeTab === "In Progress"
                ? "bg-stone-500 text-white"
                : "border bg-slate-100 text-slate-700"
            }`}
          >
            In Progress (
            {
              complaints.filter(
                (complaint) =>
                  complaint.status === "In Progress"
              ).length
            }
            )
          </button>

          <button
            onClick={() => changeTab("Resolved")}
            className={`rounded-xl px-5 py-3 ${
              activeTab === "Resolved"
                ? "bg-stone-500 text-white"
                : "border bg-slate-100 text-slate-700"
            }`}
          >
            Resolved (
            {
              complaints.filter(
                (complaint) =>
                  complaint.status === "Resolved"
              ).length
            }
            )
          </button>

          <button
            onClick={() => changeTab("Rejected")}
            className={`rounded-xl px-5 py-3 ${
              activeTab === "Rejected"
                ? "bg-stone-500 text-white"
                : "border bg-slate-100 text-slate-700"
            }`}
          >
            Rejected (
            {
              complaints.filter(
                (complaint) =>
                  complaint.status === "Rejected"
              ).length
            }
            )
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border bg-white p-10 text-center">
            <p>Loading your complaints...</p>
          </div>
        )}

        {!loading && filteredComplaints.length === 0 && (
          <div className="rounded-2xl border bg-white p-10 text-center md:p-14">
            <h2 className="text-xl font-semibold text-stone-800">
              No Complaints Found
            </h2>

            <p className="mt-2 text-gray-600">
              There are no complaints in this category.
            </p>

            <button
              onClick={() =>
                navigate("/home/create-complaint")
              }
              className="mt-6 rounded-xl bg-slate-400 px-6 py-3 font-semibold text-black"
            >
              Submit Complaint
            </button>
          </div>
        )}

        {!loading && filteredComplaints.length > 0 && (
          <div className="space-y-5">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.complaint_id}
                className="rounded-2xl border bg-slate-100 p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="text-xl font-bold text-black">
                        Title -
                      </label>

                      <h2 className="text-gray-800">
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
                  <label className="text-xl font-bold text-black">
                    Description -
                  </label>

                  <p className="leading-7">
                    {complaint.description}
                  </p>
                </div>

                <div className="mt-4 flex">
                  <label className="text-xl font-bold text-black">
                    Complaint Location -
                  </label>

                  <p className="ml-1 mt-1 text-gray-700">
                    {complaint.location || "N/A"}
                  </p>
                </div>

                <div className="mt-4 flex">
                  <h1 className="text-xl font-bold text-black">
                    Assigned to -
                  </h1>

                  <p className="ml-1 mt-1">
                    {complaint.employee_name || "Not Assigned"}
                  </p>
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
                      className="rounded-xl border px-5 py-3 font-medium text-black"
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