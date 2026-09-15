import { getMyComplaints } from "../api.js"
import { useState,useEffect } from "react";

function UserDashboard() {
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

  const approved = complaints.filter(
    (c) => c.status === "Approved"
  ).length;

  const rejected = complaints.filter(
    (c) => c.status === "Rejected"
  ).length;
  return (
    <div className="flex">
      <div className="border w-313.5 h-182">
        <div className="border">
          <h1 className="text-3xl text-center text-blue-700">Complaint Management System</h1>
        </div>
        <div className="border h-172">
          <div className="h-100 flex gap-10 justify-center items-center">
            <div className="border-3 h-60 w-50 rounded-2xl justify-center items-center flex">
              Total - {total}
            </div>
            <div className="border-3 h-60 w-50 rounded-2xl justify-center items-center flex">
              InReview - {inReview}
            </div>
            <div className="border-3 h-60 w-50 rounded-2xl justify-center items-center flex">
              Approved - {approved}
            </div>
            <div className="border-3 h-60 w-50 rounded-2xl justify-center items-center flex">
              Rejected - {rejected}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
