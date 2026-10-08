import { useEffect, useState } from "react";
import { getAdminComplaints } from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const statusFilter = searchParams.get("status");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminComplaints();
      setComplaints(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
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

  const filteredComplaints = statusFilter
    ? complaints.filter(
        (complaint) => complaint.status === statusFilter
      )
    : complaints;

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-white px-8 py-12">
        <p className="text-gray-500">Loading complaints...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-white px-8 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-black">
            Complaints
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/admin/complaints")}
            className={`rounded-2xl border border-slate-700 px-6 py-4 text-lg ${
              !statusFilter
                ? "bg-stone-500 text-white"
                : "bg-slate-50 text-slate-800"
            }`}
          >
            All ({complaints.length})
          </button>

          <button
            onClick={() =>
              navigate("/admin/complaints?status=In%20Review")
            }
            className={`rounded-2xl border border-slate-700 px-6 py-4 text-lg ${
              statusFilter === "In Review"
                ? "bg-stone-500 text-white"
                : "bg-slate-50 text-slate-800"
            }`}
          >
            In Review (
            {
              complaints.filter(
                (complaint) => complaint.status === "In Review"
              ).length
            }
            )
          </button>

          <button
            onClick={() =>
              navigate("/admin/complaints?status=In%20Progress")
            }
            className={`rounded-2xl border border-slate-700 px-6 py-4 text-lg ${
              statusFilter === "In Progress"
                ? "bg-stone-500 text-white"
                : "bg-slate-50 text-slate-800"
            }`}
          >
            In Progress (
            {
              complaints.filter(
                (complaint) => complaint.status === "In Progress"
              ).length
            }
            )
          </button>

          <button
            onClick={() =>
              navigate("/admin/complaints?status=Resolved")
            }
            className={`rounded-2xl border border-slate-700 px-6 py-4 text-lg ${
              statusFilter === "Resolved"
                ? "bg-stone-500 text-white"
                : "bg-slate-50 text-slate-800"
            }`}
          >
            Resolved (
            {
              complaints.filter(
                (complaint) => complaint.status === "Resolved"
              ).length
            }
            )
          </button>

          <button
            onClick={() =>
              navigate("/admin/complaints?status=Rejected")
            }
            className={`rounded-2xl border border-slate-700 px-6 py-4 text-lg ${
              statusFilter === "Rejected"
                ? "bg-stone-500 text-white"
                : "bg-slate-50 text-slate-800"
            }`}
          >
            Rejected (
            {
              complaints.filter(
                (complaint) => complaint.status === "Rejected"
              ).length
            }
            )
          </button>
        </div>

        {filteredComplaints.length === 0 ? (
          <div className="rounded-2xl border border-black bg-slate-100 px-6 py-12 text-center text-gray-500">
            No complaints found.
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
                        {complaint.employee_name ||
                          (complaint.employee_id
                            ? `Employee ${complaint.employee_id}`
                            : "Not Assigned")}
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
                      : "-"}
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/complaints/${complaint.complaint_id}`
                      )
                    }
                    className="rounded-2xl border border-black bg-transparent px-7 py-4 text-lg font-medium text-black hover:bg-white"
                  >
                    View
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

export default AdminComplaints;