import { useEffect, useState } from "react";

import {
    getManagedComplaints,
    getAssignmentStaff,
    assignComplaint,
    updateComplaintStatus
} from "../api";

import StatusBadge from "../components/StatusBadge";


const statuses = [
    "Submitted",
    "Under Review",
    "Assigned",
    "In Progress",
    "Resolved",
    "Closed",
    "Rejected"
];


export default function Management() {

    const [complaints, setComplaints] =
        useState([]);

    const [staff, setStaff] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {
        loadData();
    }, []);


    const loadData = async () => {

        try {

            const [
                complaintsData,
                staffData
            ] = await Promise.all([
                getManagedComplaints(),
                getAssignmentStaff()
            ]);

            setComplaints(
                complaintsData.complaints || []
            );

            setStaff(
                staffData.staff || []
            );

        } catch (error) {

            console.error(error);

            alert(error.message);

        } finally {

            setLoading(false);

        }
    };


    const handleAssign = async (
        complaintId,
        staffId
    ) => {

        if (!staffId) return;

        try {

            await assignComplaint(
                complaintId,
                staffId
            );

            alert(
                "Complaint assigned successfully."
            );

            loadData();

        } catch (error) {

            alert(error.message);

        }
    };


    const handleStatus = async (
        complaintId,
        status
    ) => {

        try {

            await updateComplaintStatus(
                complaintId,
                status,
                ""
            );

            alert(
                "Status updated successfully."
            );

            loadData();

        } catch (error) {

            alert(error.message);

        }
    };


    if (loading) {

        return (
            <div className="p-8">
                Loading management dashboard...
            </div>
        );

    }


    return (

        <div className="p-8">

            <div className="mb-8">

                <h1 className="text-2xl font-bold">
                    Complaint Management
                </h1>

                <p className="text-gray-500 mt-1">
                    Assign complaints and manage their status
                </p>

            </div>


            <div className="bg-white border rounded-xl overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="text-left px-5 py-4 text-sm">
                                    Complaint
                                </th>

                                <th className="text-left px-5 py-4 text-sm">
                                    User
                                </th>

                                <th className="text-left px-5 py-4 text-sm">
                                    Category
                                </th>

                                <th className="text-left px-5 py-4 text-sm">
                                    Priority
                                </th>

                                <th className="text-left px-5 py-4 text-sm">
                                    Assigned Staff
                                </th>

                                <th className="text-left px-5 py-4 text-sm">
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {complaints.map(
                                complaint => (

                                    <tr
                                        key={
                                            complaint.complaint_id
                                        }
                                        className="border-t"
                                    >

                                        <td className="px-5 py-5">

                                            <p className="font-medium">
                                                #{complaint.complaint_id}
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {complaint.subject}
                                            </p>

                                        </td>


                                        <td className="px-5 py-5">
                                            {complaint.user_name}
                                        </td>


                                        <td className="px-5 py-5">
                                            {complaint.category_name}
                                        </td>


                                        <td className="px-5 py-5">
                                            {complaint.priority}
                                        </td>


                                        <td className="px-5 py-5">

                                            <select
                                                value={
                                                    complaint.staff_id ||
                                                    ""
                                                }
                                                onChange={e =>
                                                    handleAssign(
                                                        complaint.complaint_id,
                                                        e.target.value
                                                    )
                                                }
                                                className="border rounded-lg px-3 py-2 text-sm"
                                            >

                                                <option value="">
                                                    Unassigned
                                                </option>

                                                {staff.map(
                                                    member => (

                                                        <option
                                                            key={
                                                                member.staff_id
                                                            }
                                                            value={
                                                                member.staff_id
                                                            }
                                                        >
                                                            {
                                                                member.staff_name
                                                            }
                                                            {" - "}
                                                            {
                                                                member.designation
                                                            }
                                                        </option>

                                                    )
                                                )}

                                            </select>

                                        </td>


                                        <td className="px-5 py-5">

                                            <div className="space-y-2">

                                                <StatusBadge
                                                    status={
                                                        complaint.status
                                                    }
                                                />

                                                <select
                                                    value={
                                                        complaint.status
                                                    }
                                                    onChange={e =>
                                                        handleStatus(
                                                            complaint.complaint_id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block border rounded-lg px-3 py-2 text-sm"
                                                >

                                                    {statuses.map(
                                                        status => (

                                                            <option
                                                                key={
                                                                    status
                                                                }
                                                                value={
                                                                    status
                                                                }
                                                            >
                                                                {status}
                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}