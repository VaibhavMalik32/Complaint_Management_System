import { useEffect, useState } from "react";
import {
  getAssignedComplaints,
  addComplaintAction,
} from "../api.js";

function ComplaintAction() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [proofImage, setProofImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAssignedComplaints();
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

  const selectedComplaintData = complaints.find(
    (complaint) =>
      String(complaint.complaint_id) ===
      String(selectedComplaint)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedComplaint) {
      setError("Please select a complaint.");
      return;
    }

    if (!actionTaken.trim()) {
      setError("Please enter the action taken.");
      return;
    }

    setSubmitting(true);

    try {
      await addComplaintAction(
        selectedComplaint,
        actionTaken,
        proofImage
      );

      setSuccess(
        "Complaint action added successfully."
      );

      setSelectedComplaint("");
      setActionTaken("");
      setProofImage(null);

      await fetchComplaints();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">

      <div className="border-b px-8 py-4">
        <h1 className="text-center text-3xl font-semibold">
          Complaint Action
        </h1>
      </div>

      <div className="mx-auto max-w-3xl px-8 py-10">

        <div className="rounded-2xl border p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Add Action
          </h2>

          {error && (
            <p className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-green-600">
              {success}
            </p>
          )}

          {loading ? (
            <p>Loading complaints...</p>
          ) : (
            <form onSubmit={handleSubmit}>

              <div className="mb-6">

                <label className="mb-2 block font-medium">
                  Select Complaint
                </label>

                <select
                  value={selectedComplaint}
                  onChange={(e) =>
                    setSelectedComplaint(e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3 outline-none"
                >

                  <option value="">
                    Select Complaint
                  </option>

                  {complaints
                    .filter(
                      (complaint) =>
                        complaint.status !== "Resolved"
                    )
                    .map((complaint) => (
                      <option
                        key={complaint.complaint_id}
                        value={complaint.complaint_id}
                      >
                        #{complaint.complaint_id} -{" "}
                        {complaint.title}
                      </option>
                    ))}

                </select>

              </div>

              {selectedComplaintData && (
                <div className="mb-6 rounded-xl border bg-gray-50 p-5">

                  <h3 className="mb-4 font-semibold text-gray-800">
                    Complaint Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>
                      <p className="text-sm text-gray-500">
                        Title
                      </p>

                      <p className="font-medium">
                        {selectedComplaintData.title}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Category
                      </p>

                      <p className="font-medium">
                        {selectedComplaintData.category}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Location
                      </p>

                      <p className="font-medium">
                        {selectedComplaintData.location ||
                          "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Status
                      </p>

                      <p className="font-medium">
                        {selectedComplaintData.status}
                      </p>
                    </div>

                  </div>

                  <div className="mt-4">

                    <p className="text-sm text-gray-500">
                      Description
                    </p>

                    <p className="mt-1 text-gray-700">
                      {selectedComplaintData.description}
                    </p>

                  </div>

                </div>
              )}

              <div className="mb-6">

                <label className="mb-2 block font-medium">
                  Action Taken
                </label>

                <textarea
                  value={actionTaken}
                  onChange={(e) =>
                    setActionTaken(e.target.value)
                  }
                  placeholder="Describe the action taken..."
                  className="h-32 w-full resize-none rounded-lg border px-4 py-3 outline-none"
                  required
                />

              </div>

              <div className="mb-6">

                <label className="mb-2 block font-medium">
                  Proof Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProofImage(
                      e.target.files?.[0] || null
                    )
                  }
                  className="w-full rounded-lg border px-3 py-2"
                />

                {proofImage && (
                  <p className="mt-2 text-sm text-gray-600">
                    {proofImage.name}
                  </p>
                )}

              </div>

              <div className="flex justify-end">

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-black px-6 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : "Save Action"}
                </button>

              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}

export default ComplaintAction;