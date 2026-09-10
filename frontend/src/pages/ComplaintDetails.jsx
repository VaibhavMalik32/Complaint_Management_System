import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
    getComplaint,
    getComplaintHistory,
    getResolution
} from "../api";

import StatusBadge from "../components/StatusBadge";


export default function ComplaintDetails() {

    const { id } = useParams();

    const [complaint, setComplaint] =
        useState(null);

    const [history, setHistory] =
        useState([]);

    const [resolution, setResolution] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {
        loadData();
    }, [id]);


    const loadData = async () => {

        try {

            const [
                complaintData,
                historyData,
                resolutionData
            ] = await Promise.all([
                getComplaint(id),
                getComplaintHistory(id),
                getResolution(id)
            ]);

            setComplaint(
                complaintData.complaint
            );

            setHistory(
                historyData.updates || []
            );

            setResolution(
                resolutionData.resolution
            );

        } catch (error) {

            console.error(error);

            alert(error.message);

        } finally {

            setLoading(false);

        }
    };


    if (loading) {

        return (
            <div className="p-8">
                Loading complaint...
            </div>
        );

    }


    if (!complaint) {

        return (
            <div className="p-8">
                Complaint not found.
            </div>
        );

    }


    return (

        <div className="p-8">

            <div className="mb-6">

                <Link
                    to="/complaints"
                    className="text-blue-600 text-sm hover:underline"
                >
                    ← Back to complaints
                </Link>

            </div>


            <div className="flex justify-between items-start mb-8">

                <div>

                    <p className="text-sm text-gray-500">
                        Complaint #{complaint.complaint_id}
                    </p>

                    <h1 className="text-2xl font-bold mt-1">
                        {complaint.subject}
                    </h1>

                </div>


                <StatusBadge
                    status={complaint.status}
                />

            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main */}

                <div className="lg:col-span-2 space-y-6">

                    <section className="bg-white border rounded-xl p-6">

                        <h2 className="font-semibold mb-4">
                            Complaint Description
                        </h2>

                        <p className="text-gray-600 leading-7 whitespace-pre-wrap">
                            {complaint.description}
                        </p>

                    </section>


                    {resolution && (

                        <section className="bg-white border rounded-xl p-6">

                            <h2 className="font-semibold mb-4">
                                Resolution
                            </h2>

                            <p className="text-gray-600 leading-7">
                                {resolution.resolution_text}
                            </p>

                            <p className="text-sm text-gray-500 mt-4">
                                Resolved by:{" "}
                                {resolution.resolved_by_name}
                            </p>

                        </section>

                    )}


                    <section className="bg-white border rounded-xl p-6">

                        <h2 className="font-semibold mb-6">
                            Complaint History
                        </h2>


                        {history.length === 0 ? (

                            <p className="text-gray-500">
                                No history available.
                            </p>

                        ) : (

                            <div className="space-y-6">

                                {history.map(update => (

                                    <div
                                        key={update.update_id}
                                        className="border-l-2 border-blue-500 pl-5"
                                    >

                                        <div className="flex justify-between">

                                            <p className="font-medium">
                                                {update.new_status}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {new Date(
                                                    update.updated_at
                                                ).toLocaleString()}
                                            </p>

                                        </div>


                                        <p className="text-sm text-gray-500 mt-1">
                                            Updated by{" "}
                                            {update.updated_by_name}
                                        </p>


                                        {update.remarks && (

                                            <p className="text-sm text-gray-600 mt-2">
                                                {update.remarks}
                                            </p>

                                        )}

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>

                </div>


                {/* Details */}

                <div>

                    <section className="bg-white border rounded-xl p-6">

                        <h2 className="font-semibold mb-5">
                            Complaint Information
                        </h2>


                        <Info
                            label="User"
                            value={complaint.user_name}
                        />

                        <Info
                            label="Organization"
                            value={complaint.organization_name}
                        />

                        <Info
                            label="Category"
                            value={complaint.category_name}
                        />

                        <Info
                            label="Priority"
                            value={complaint.priority}
                        />

                        <Info
                            label="Status"
                            value={complaint.status}
                        />

                        <Info
                            label="Created"
                            value={
                                new Date(
                                    complaint.created_at
                                ).toLocaleString()
                            }
                        />

                    </section>

                </div>

            </div>

        </div>
    );
}


function Info({ label, value }) {

    return (

        <div className="py-3 border-b last:border-b-0">

            <p className="text-xs text-gray-500">
                {label}
            </p>

            <p className="font-medium mt-1">
                {value || "-"}
            </p>

        </div>
    );
}