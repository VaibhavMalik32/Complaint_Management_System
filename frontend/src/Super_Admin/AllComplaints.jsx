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

      for (const complaint of data) {
        try {
          const action = await getSuperAdminComplaintAction(
            complaint.complaint_id
          );
          actionData[complaint.complaint_id] = action;
        } catch {
          actionData[complaint.complaint_id] = null;
        }
      }

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
      <div className="p-8">
        <p>Loading complaints...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          All Complaints
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor all complaints and employee actions
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
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
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        #{complaint.complaint_id}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {complaint.title}
                      </td>

                      <td className="px-6 py-4">
                        {complaint.category}
                      </td>

                      <td className="px-6 py-4">
                        {complaint.employee_id ? (
                          `Employee #${complaint.employee_id}`
                        ) : (
                          <span className="text-gray-400">
                            Not Assigned
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
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
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                          >
                            View Action
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No Action
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Complaint Action
              </h2>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Complaint</p>
                <p className="font-semibold">
                  #{selectedComplaint.complaint.complaint_id}{" "}
                  {selectedComplaint.complaint.title}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Employee</p>
                <p>
                  Employee #{selectedComplaint.action.employee_id}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Action Taken</p>
                <p className="mt-1 bg-gray-50 rounded-xl p-4">
                  {selectedComplaint.action.action_taken}
                </p>
              </div>

              {selectedComplaint.action.proof_image && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Proof Image
                  </p>

                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${selectedComplaint.action.proof_image}`}
                    alt="Action proof"
                    className="w-full max-h-96 object-contain rounded-xl border"
                  />
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Action Date</p>
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
              className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800"
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