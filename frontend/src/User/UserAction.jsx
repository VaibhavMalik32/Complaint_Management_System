import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getComplaintAction } from "../api.js";

function UserAction() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchAction = async () => {
      try {
        const data = await getComplaintAction(complaintId);
        setAction(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAction();
  }, [complaintId]);
  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="border-b px-8 py-4">
        <h1 className="text-center text-3xl font-semibold">
          Action Taken
        </h1>
      </div>
      <div className="mx-auto max-w-3xl px-8 py-10">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
            {error}
          </div>
        ) : action ? (
          <div className="rounded-2xl border p-8">
            <div className="mb-6">
              <p className="text-sm text-black">
                Complaint ID - {action.complaint_id}
              </p>
            </div>
            <div className="mb-6">
              <p className="mb-2 font-semibold">
                Action Taken
              </p>
              <div className="rounded-xl border p-5">
                <p className="">
                  {action.action_taken}
                </p>
              </div>
            </div>
            {action.proof_image && (
              <div className="mb-6">
                <p className="mb-3 font-semibold">
                  Proof
                </p>
                <div className="rounded-xl border p-3">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${action.proof_image}`}
                    alt="Proof"
                    className="max-h-96 w-full rounded-lg object-contain"
                  />
                </div>
              </div>
            )}
            <button
              onClick={() => navigate("/home/complaints")}
              className="rounded-xl bg-black px-6 py-3 font-semibold text-white"
            >
              Back to My Complaints
            </button>

          </div>
        ) : null}
      </div>
    </div>
  );
}

export default UserAction;