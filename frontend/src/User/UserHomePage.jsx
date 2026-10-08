import { getMyComplaints } from "../api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserHomePage() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await getMyComplaints();
      setComplaints(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const total = complaints.length;

  const inReview = complaints.filter(
    (c) => c.status === "In Review"
  ).length;

  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const rejected = complaints.filter(
    (c) => c.status === "Rejected"
  ).length;

  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
    )
    .slice(0, 3);

  const complaintCard = (label, value, status) => (
    <button
      onClick={() =>
        navigate(`/home/complaints?status=${encodeURIComponent(status)}`)
      }
      className="h-30 rounded-2xl border-2 flex items-center justify-center"
    >
      {label} - {value}
    </button>
  );

  return (
    <div className="w-full min-h-screen bg-slate-100/50">
      <div className="w-full">
        <div className="border p-4">
          <h1 className="text-3xl text-center font-bold text-black">
            Complaint Management System
          </h1>
        </div>

        <div className="p-8 flex">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 w-100 gap-8">

            {complaintCard("Total", total, "all")}

            {complaintCard(
              "In Review",
              inReview,
              "In Review"
            )}

            {complaintCard(
              "In Progress",
              inProgress,
              "In Progress"
            )}

            {complaintCard(
              "Resolved",
              resolved,
              "Resolved"
            )}

            {complaintCard(
              "Rejected",
              rejected,
              "Rejected"
            )}

          </div>

          <div className="ml-20">
            <h2 className="text-2xl font-bold mb-5 text-black">
              Recent Complaints
            </h2>

            {loading ? (
              <div className="border rounded-xl p-8 text-center">
                Loading complaints...
              </div>
            ) : recentComplaints.length === 0 ? (
              <div className="border rounded-xl p-8 text-center">
                No complaints found.
              </div>
            ) : (
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-100">
                      <th className="text-left px-5 py-4">
                        ID
                      </th>

                      <th className="text-left px-5 py-4">
                        Title
                      </th>

                      <th className="text-left px-5 py-4">
                        Category
                      </th>

                      <th className="text-left px-5 py-4">
                        Status
                      </th>

                      <th className="text-left px-5 py-4">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentComplaints.map((complaint) => (
                      <tr
                        key={complaint.complaint_id}
                        className="border-b"
                      >
                        <td className="px-5 py-4">
                          {complaint.complaint_id}
                        </td>

                        <td className="px-5 py-4">
                          {complaint.title}
                        </td>

                        <td className="px-5 py-4">
                          {complaint.category}
                        </td>

                        <td className="px-5 py-4">
                          {complaint.status}
                        </td>

                        <td className="px-5 py-4">
                          {complaint.created_at
                            ? new Date(
                                complaint.created_at
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHomePage;