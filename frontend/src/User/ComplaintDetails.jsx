import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getComplaint, getComplaintHistory } from "../api.js";

function ComplaintDetails() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getComplaint(complaintId);
        const historyData = await getComplaintHistory(complaintId);
        setComplaint(data);
        setHistory(historyData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [complaintId]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <p>Complaint not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="border-b px-8 py-4">
        <h1 className="text-center text-3xl font-semibold">
          Complaint Details
        </h1>
      </div>

      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="rounded-2xl border p-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Title - {complaint.title}
              </h2>
            </div>

            <span className="rounded-xl border px-4 py-2">
              {complaint.status}
            </span>
          </div>

          <div className="mt-6 border-t pt-6">
            <div className="mb-5">
              <p className="font-semibold">
                Category - {complaint.category}
              </p>
            </div>

            <div className="mb-5">
              <p className="font-semibold">Complaint Location</p>
              <p className="mt-1">{complaint.location || "N/A"}</p>

              {complaint.latitude != null &&
                complaint.longitude != null && (
                  <a
                    href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                  >
                    View on Map
                  </a>
                )}
            </div>

            <div className="mb-5">
              <p className="font-semibold">Description</p>
              <p className="mt-1 whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            <div className="mb-5">
              <p className="font-semibold">
                Submitted On -{" "}
                {complaint.created_at
                  ? new Date(complaint.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <h3 className="mb-5 text-xl font-semibold">
              Evidence Images
            </h3>

            {complaint.images && complaint.images.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {complaint.images.map((image) => (
                  <div
                    key={image.image_id}
                    className="rounded-xl border p-3"
                  >
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${image.image_path}`}
                      alt="Complaint evidence"
                      className="h-64 w-full rounded-lg object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No images available.</p>
            )}
          </div>

          {showHistory && (
            <div className="mt-8 border-t pt-6">
              <h3 className="mb-6 text-xl font-semibold">
                Complaint History
              </h3>

              {history.length > 0 ? (
                <div className="relative ml-2">
                  <div className="absolute left-3 top-3 bottom-3 w-px bg-gray-300" />

                  <div className="space-y-6">
                    {history.map((item) => (
                      <div
                        key={item.update_id}
                        className="relative flex gap-5"
                      >
                        <div className="relative z-10 mt-1 h-7 w-7 shrink-0 rounded-full border-4 border-white bg-black" />

                        <div className="flex-1 rounded-xl border bg-gray-50 p-5">
                          <div className="flex flex-col gap-1">
                            <p className="text-lg font-semibold">
                              {item.action || "Status Changed"}
                            </p>

                            {item.action === "Complaint Submitted" ? (
                              <p className="text-sm text-gray-700">
                                Complaint Submitted
                              </p>
                            ) : item.action === "Assigned" ? (
                              <>
                                <p className="text-sm text-gray-700">
                                  Assigned to{" "}
                                  <span className="font-semibold">
                                    {item.assigned_to_name || "Employee"}
                                  </span>
                                </p>

                                <p className="text-sm text-gray-600">
                                  By:{" "}
                                  <span className="font-medium">
                                    {item.performed_by_name || "Admin"}
                                  </span>
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm text-gray-700">
                                  Status:{" "}
                                  <span className="font-medium">
                                    {item.old_status}
                                  </span>{" "}
                                  →{" "}
                                  <span className="font-medium">
                                    {item.new_status}
                                  </span>
                                </p>

                                <p className="text-sm text-gray-600">
                                  By:{" "}
                                  <span className="font-medium">
                                    {item.performed_by_name || "User"}
                                  </span>
                                </p>
                              </>
                            )}

                            <p className="mt-2 text-sm text-gray-500">
                              {item.updated_at
                                ? new Date(item.updated_at).toLocaleString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true
                                    }
                                  )
                                : "Date unavailable"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  No complaint history available.
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/home/complaints")}
              className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100"
            >
              Back to Complaints
            </button>

            <button
              onClick={() => setShowHistory((prev) => !prev)}
              className="rounded-xl bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
            >
              {showHistory ? "Hide Complaint History" : "Complaint History"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;