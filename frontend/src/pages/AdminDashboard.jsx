import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getComplaints } from "../api";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = async () => {

        try {

            const data = await getComplaints();

            setComplaints(data.complaints || []);

        } catch (error) {

            console.error("Error loading complaints:", error);

        } finally {

            setLoading(false);

        }
    };


    const total = complaints.length;

    const submitted =
        complaints.filter(
            c => c.status === "Submitted"
        ).length;

    const underReview =
        complaints.filter(
            c => c.status === "Under Review"
        ).length;

    const assigned =
        complaints.filter(
            c => c.status === "Assigned"
        ).length;

    const inProgress =
        complaints.filter(
            c => c.status === "In Progress"
        ).length;

    const resolved =
        complaints.filter(
            c =>
                c.status === "Resolved" ||
                c.status === "Closed"
        ).length;

    const critical =
        complaints.filter(
            c => c.priority === "Critical"
        ).length;


    if (loading) {

        return (
            <div className="p-8">
                Loading admin dashboard...
            </div>
        );

    }


    return (
        <div className="p-8">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

                <div>

                    <h1 className="text-2xl font-bold">
                        Admin Dashboard
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage complaints and system resources
                    </p>

                </div>

                <Link
                    to="/management"
                    className="mt-4 md:mt-0 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
                >
                    Manage Complaints
                </Link>

            </div>


            {/* Main Statistics */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

                <StatCard
                    title="Total Complaints"
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


            {/* Additional Statistics */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                <StatCard
                    title="Under Review"
                    value={underReview}
                    icon="🔍"
                />

                <StatCard
                    title="Assigned"
                    value={assigned}
                    icon="👨‍💼"
                />

                <StatCard
                    title="Critical Complaints"
                    value={critical}
                    icon="⚠️"
                />

            </div>


            {/* Quick Management */}

            <div className="mb-8">

                <h2 className="text-lg font-semibold mb-4">
                    System Management
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                    <ManagementCard
                        title="Complaints"
                        description="View and manage all complaints"
                        icon="📋"
                        to="/management"
                    />

                    <ManagementCard
                        title="Organizations"
                        description="Manage organizations"
                        icon="🏢"
                        to="/organizations"
                    />

                    <ManagementCard
                        title="Departments"
                        description="Manage departments"
                        icon="🏛️"
                        to="/departments"
                    />

                    <ManagementCard
                        title="Categories"
                        description="Manage complaint categories"
                        icon="🏷️"
                        to="/categories"
                    />

                    <ManagementCard
                        title="Staff"
                        description="Manage staff members"
                        icon="👨‍💼"
                        to="/staff"
                    />

                </div>

            </div>


            {/* Recent Complaints */}

            <div className="bg-white rounded-xl border overflow-hidden">

                <div className="flex items-center justify-between px-6 py-5 border-b">

                    <div>

                        <h2 className="font-semibold text-lg">
                            Recent Complaints
                        </h2>

                        <p className="text-sm text-gray-500">
                            Latest complaints submitted by users
                        </p>

                    </div>

                    <Link
                        to="/management"
                        className="text-blue-600 text-sm font-medium hover:underline"
                    >
                        View all
                    </Link>

                </div>


                {complaints.length === 0 ? (

                    <div className="p-10 text-center text-gray-500">
                        No complaints found.
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
                                        User
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
                                                {complaint.user_name}
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


function ManagementCard({
    title,
    description,
    icon,
    to
}) {

    return (

        <Link
            to={to}
            className="bg-white border rounded-xl p-5 hover:shadow-md transition"
        >

            <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-xl">
                    {icon}
                </div>

                <div>

                    <h3 className="font-semibold">
                        {title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        {description}
                    </p>

                </div>

            </div>

        </Link>

    );
}