import { useEffect, useState } from "react";
import { getAdminComplaints } from "../api";
import { useNavigate } from "react-router-dom";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
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
  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 p-8">
        <p className="text-gray-500">
          Loading complaints...
        </p>
      </div>
    );
  }
  return (
    <div className="flex-1 min-h-screen bg-green-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800">
          Complaints
        </h1>
      </div>
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}
      <div className="bg-green-100 rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-100">
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
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {complaints.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No complaints found for your department and location
                  </td>
                </tr>
              ) : (
                complaints.map((complaint) => (
                  <tr
                    key={complaint.complaint_id}
                    className="border-t bg-green-50"
                  >
                    <td className="px-6 py-4">
                      {complaint.complaint_id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {complaint.title}
                    </td>
                    <td className="px-6 py-4">
                      {complaint.category}
                    </td>
                    <td className="px-6 py-4">
                      {complaint.location || "N/A"}
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
                      {complaint.employee_id ? (
                        `Employee ${complaint.employee_id}`
                      ) : (
                        <span className="text-gray-400">
                          Not Assigned
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
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/complaints/${complaint.complaint_id}`
                          )
                        }
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminComplaints;