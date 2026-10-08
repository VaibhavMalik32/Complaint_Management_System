import { useEffect, useState } from "react";
import {
  getSuperAdminAllComplaints,
  getSuperAdminComplaintAction,
} from "../api";

function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [actions, setActions] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await getSuperAdminAllComplaints();

      setComplaints(data);

      const actionData = {};

      await Promise.all(
        data.map(async (complaint) => {
          try {
            const action = await getSuperAdminComplaintAction(
              complaint.complaint_id
            );

            actionData[complaint.complaint_id] = action;
          } catch {
            actionData[complaint.complaint_id] = null;
          }
        })
      );

      setActions(actionData);
    } catch (error) {
      console.error(error);
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p>Loading complaints...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-slate-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">
          All Complaints
        </h1>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  ID
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Title
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Employee
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Action
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {complaints.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No complaints found
                  </td>
                </tr>
              ) : (
                complaints.map((complaint) => {
                  const action = actions[complaint.complaint_id];

                  return (
                    <tr
                      key={complaint.complaint_id}
                      className="border-t bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        {complaint.complaint_id}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {complaint.title}
                      </td>

                      <td className="px-6 py-4">
                        {complaint.category}
                      </td>

                      <td className="px-6 py-4">
                        {complaint.employee_id ? (
                          `Employee ${complaint.employee_id}`
                        ) : (
                          <span className="text-gray-400">
                            Not Assigned
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {action ? (
                          <button
                            onClick={() =>
                              setSelectedComplaint({
                                complaint,
                                action,
                              })
                            }
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
                          >
                            View Action
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">
                            No Action
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {complaint.created_at
                          ? new Date(
                              complaint.created_at
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-100 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">
                Complaint Action
              </h2>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-xl text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex">
                <p className="text-sm font-bold text-black">
                  Complaint -
                </p>

                <p className="ml-1">
                  {selectedComplaint.complaint.title}
                </p>
              </div>

              <div className="flex">
                <p className="text-sm font-bold text-black">
                  Employee -
                </p>

                <p className="ml-1">
                  Employee {selectedComplaint.action.employee_id}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-black">
                  Action Taken
                </p>

                <p className="mt-1 rounded-xl border bg-slate-50 p-4">
                  {selectedComplaint.action.action_taken}
                </p>
              </div>

              {selectedComplaint.action.proof_image && (
                <div>
                  <p className="mb-2 text-sm text-green-700">
                    Proof Image
                  </p>

                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${selectedComplaint.action.proof_image}`}
                    alt="Action proof"
                    className="max-h-96 w-full rounded-xl border object-contain"
                  />
                </div>
              )}

              <div>
                <p className="text-sm font-bold text-black">
                  Action Date
                </p>

                <p>
                  {selectedComplaint.action.created_at
                    ? new Date(
                        selectedComplaint.action.created_at
                      ).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedComplaint(null)}
              className="mt-6 w-full rounded-xl border py-3 text-black hover:bg-black hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllComplaints;