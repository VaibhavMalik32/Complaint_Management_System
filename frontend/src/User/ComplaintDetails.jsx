import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getComplaint } from "../api.js";

function ComplaintDetails() {
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

        const data = await getComplaint(complaintId);
        setComplaint(data);
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
              <p className="font-semibold">
                Complaint Location
              </p>

              <p className="mt-1">
                {complaint.location || "N/A"}
              </p>
            </div>

            <div className="mb-5">
              <p className="font-semibold">
                Description
              </p>

              <p className="mt-1 whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            <div className="mb-5">
              <p className="font-semibold">
                Submitted On -{" "}
                {complaint.created_at
                  ? new Date(
                      complaint.created_at
                    ).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

          </div>

          <div className="mt-6 border-t pt-6">

            <h3 className="mb-5 text-xl font-semibold">
              Evidence Images
            </h3>

            {complaint.images &&
            complaint.images.length > 0 ? (
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
              <p className="text-gray-500">
                No images available.
              </p>
            )}

          </div>

          <div className="mt-8">

            <button
              onClick={() => navigate("/home/complaints")}
              className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100"
            >
              Back to My Complaints
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ComplaintDetails;