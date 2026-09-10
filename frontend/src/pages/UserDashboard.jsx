import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserComplaints } from "../api";
import StatusBadge from "../components/StatusBadge";

// Temporary user ID.
// Later this will come from authentication.
const CURRENT_USER_ID = 1;

export default function Dashboard() {

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = async () => {

        try {

            const data = await getUserComplaints(CURRENT_USER_ID);

            setComplaints(data.complaints || []);

        } catch (error) {

            console.error("Error loading user complaints:", error);

        } finally {

            setLoading(false);

        }
    };


    const total = complaints.length;

    const submitted =
        complaints.filter(
            c => c.status === "Submitted"
        ).length;

    const inProgress =
        complaints.filter(
            c =>
                c.status === "In Progress" ||
                c.status === "Under Review" ||
                c.status === "Assigned"
        ).length;

    const resolved =
        complaints.filter(
            c =>
                c.status === "Resolved" ||
                c.status === "Closed"
        ).length;


    if (loading) {

        return (
            <div className="p-8">
                Loading dashboard...
            </div>
        );

    }


    return (
        <div className="p-8">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

                <div>

                    <h1 className="text-2xl font-bold">
                        User Dashboard
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View and track your complaints
                    </p>

                </div>

                <Link
                    to="/user/complaints"
                    className="mt-4 md:mt-0 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
                >
                    + Add Complaint
                </Link>

            </div>


            {/* Statistics */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

                <StatCard
                    title="My Complaints"
                    value={total}
                    icon="📋"
                />

                <StatCard
                    title="Submitted"
                    value={submitted}
                    icon="📨"
                />

                <StatCard
                    title="In Progress"
                    value={inProgress}
                    icon="⚙️"
                />

                <StatCard
                    title="Resolved"
                    value={resolved}
                    icon="✓"
                />

            </div>


            {/* My Complaints */}

            <div className="bg-white rounded-xl border overflow-hidden">

                <div className="flex items-center justify-between px-6 py-5 border-b">

                    <div>

                        <h2 className="font-semibold text-lg">
                            My Complaints
                        </h2>

                        <p className="text-sm text-gray-500">
                            Track the status of your complaints
                        </p>

                    </div>

                    <Link
                        to="/user/complaints"
                        className="text-blue-600 text-sm font-medium hover:underline"
                    >
                        View all
                    </Link>

                </div>


                {complaints.length === 0 ? (

                    <div className="p-10 text-center">

                        <p className="text-gray-500 mb-4">
                            You have not submitted any complaints yet.
                        </p>

                        <Link
                            to="/complaints"
                            className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
                        >
                            Submit Your First Complaint
                        </Link>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="text-left px-6 py-4 text-sm">
                                        ID
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm">
                                        Subject
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm">
                                        Organization
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm">
                                        Category
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm">
                                        Priority
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm">
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {complaints
                                    .slice(0, 5)
                                    .map(complaint => (

                                        <tr
                                            key={complaint.complaint_id}
                                            className="border-t hover:bg-gray-50"
                                        >

                                            <td className="px-6 py-4">
                                                #{complaint.complaint_id}
                                            </td>

                                            <td className="px-6 py-4">

                                                <Link
                                                    to={`/complaints/${complaint.complaint_id}`}
                                                    className="font-medium text-blue-600 hover:underline"
                                                >
                                                    {complaint.subject}
                                                </Link>

                                            </td>

                                            <td className="px-6 py-4">
                                                {complaint.organization_name}
                                            </td>

                                            <td className="px-6 py-4">
                                                {complaint.category_name}
                                            </td>

                                            <td className="px-6 py-4">
                                                {complaint.priority}
                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge
                                                    status={complaint.status}
                                                />
                                            </td>

                                        </tr>

                                    ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}


function StatCard({
    title,
    value,
    icon
}) {

    return (

        <div className="bg-white border rounded-xl p-6">

            <div className="flex justify-between items-start">

                <div>

                    <p className="text-gray-500 text-sm">
                        {title}
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {value}
                    </p>

                </div>

                <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-xl">
                    {icon}
                </div>

            </div>

        </div>
    );
}