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
      <div className="w-full min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  if (!complaint) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p>Complaint not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="border-b px-8 py-4">
        <h1 className="text-center text-3xl font-semibold">
          Complaint Details
        </h1>
      </div>
      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="rounded-2xl border p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Title - {complaint.title}
              </h2>
            </div>
            <span className="rounded-xl border px-4 py-2">
              {complaint.status}
            </span>
          </div>
          <div className="pt-6">
            <div className="mb-5">
              <p className="font-semibold">
                Category
              </p>
              <p className="mt-1">
                {complaint.category}
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
                Submitted On
              </p>
              <p className="mt-1">
                {complaint.created_at
                  ? new Date(
                      complaint.created_at
                    ).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-5">
              Evidence Images
            </h3>
            {complaint.images &&
            complaint.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {complaint.images.map((image) => (
                  <div
                    key={image.image_id}
                    className="border rounded-xl p-3"
                  >
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${image.image_path}`}
                      alt="Complaint evidence"
                      className="w-full h-64 object-cover rounded-lg"
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