import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
    getComplaints,
    getUserComplaints,
    getUsers,
    getOrganizations,
    getCategories,
    createComplaint
} from "../api";

import StatusBadge from "../components/StatusBadge";


// Temporary user ID.
// Since authentication is not implemented yet.
const CURRENT_USER_ID = 1;


export default function Complaints() {

    const location = useLocation();

    // Check whether this page is being opened
    // from the user section.
    const isUserPage =
        location.pathname.startsWith("/user/complaints");


    const [complaints, setComplaints] = useState([]);

    const [users, setUsers] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // Form
    const [userId, setUserId] = useState(
        CURRENT_USER_ID
    );

    const [organizationId, setOrganizationId] =
        useState("");

    const [categoryId, setCategoryId] =
        useState("");

    const [subject, setSubject] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [priority, setPriority] =
        useState("Medium");

    const [submitting, setSubmitting] =
        useState(false);


    useEffect(() => {

        loadData();

    }, [isUserPage]);


    const loadData = async () => {

        setLoading(true);
        setError("");

        try {

            // -----------------------------
            // USER PAGE
            // -----------------------------

            if (isUserPage) {

                const [
                    complaintsData,
                    organizationsData,
                    categoriesData
                ] = await Promise.all([

                    getUserComplaints(
                        CURRENT_USER_ID
                    ),

                    getOrganizations(),

                    getCategories()

                ]);


                setComplaints(
                    complaintsData.complaints || []
                );

                setOrganizations(
                    organizationsData.organizations || []
                );

                setCategories(
                    categoriesData.categories || []
                );

                setUserId(CURRENT_USER_ID);

            }

            // -----------------------------
            // ADMIN PAGE
            // -----------------------------

            else {

                const [
                    complaintsData,
                    usersData,
                    organizationsData,
                    categoriesData
                ] = await Promise.all([

                    getComplaints(),

                    getUsers(),

                    getOrganizations(),

                    getCategories()

                ]);


                setComplaints(
                    complaintsData.complaints || []
                );

                setUsers(
                    usersData.users || []
                );

                setOrganizations(
                    organizationsData.organizations || []
                );

                setCategories(
                    categoriesData.categories || []
                );

            }

        } catch (error) {

            console.error(
                "Error loading complaints:",
                error
            );

            setError(
                "Failed to load complaints."
            );

        } finally {

            setLoading(false);

        }

    };


    // --------------------------------
    // CREATE COMPLAINT
    // --------------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSubmitting(true);
        setError("");

        try {

            const data = await createComplaint({

                user_id: isUserPage
                    ? CURRENT_USER_ID
                    : userId,

                organization_id: organizationId,

                category_id: categoryId,

                subject: subject,

                description: description,

                priority: priority

            });


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Failed to create complaint"
                );

            }


            // Clear form

            setOrganizationId("");
            setCategoryId("");
            setSubject("");
            setDescription("");
            setPriority("Medium");


            // Reload complaints

            await loadData();


            alert(
                "Complaint submitted successfully!"
            );


        } catch (error) {

            console.error(
                "Create complaint error:",
                error
            );

            setError(
                error.message ||
                "Failed to create complaint."
            );

        } finally {

            setSubmitting(false);

        }

    };


    if (loading) {

        return (
            <div className="p-8">
                Loading complaints...
            </div>
        );

    }


    return (

        <div className="p-8">


            {/* PAGE HEADER */}

            <div className="flex items-center justify-between mb-8">

                <div>

                    <h1 className="text-2xl font-bold">

                        {isUserPage
                            ? "My Complaints"
                            : "Complaints"
                        }

                    </h1>


                    <p className="text-gray-500 mt-1">

                        {isUserPage
                            ? "Submit and track your complaints"
                            : "View and manage all complaints"
                        }

                    </p>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">

                    {error}

                </div>

            )}


            {/* ADD COMPLAINT */}

            <div className="bg-white border rounded-xl p-6 mb-8">

                <h2 className="text-lg font-semibold mb-5">

                    {isUserPage
                        ? "Submit a Complaint"
                        : "Add Complaint"
                    }

                </h2>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >


                    {/* USER */}

                    {!isUserPage && (

                        <div>

                            <label className="block text-sm font-medium mb-2">

                                User

                            </label>


                            <select
                                value={userId}
                                onChange={(e) =>
                                    setUserId(
                                        e.target.value
                                    )
                                }
                                required
                                className="w-full border rounded-lg px-4 py-2.5"
                            >

                                <option value="">
                                    Select User
                                </option>

                                {users.map(user => (

                                    <option
                                        key={user.user_id}
                                        value={user.user_id}
                                    >
                                        {user.name}
                                    </option>

                                ))}

                            </select>

                        </div>

                    )}


                    {/* ORGANIZATION */}

                    <div>

                        <label className="block text-sm font-medium mb-2">

                            Organization

                        </label>


                        <select
                            value={organizationId}
                            onChange={(e) => {

                                setOrganizationId(
                                    e.target.value
                                );

                                setCategoryId("");

                            }}
                            required
                            className="w-full border rounded-lg px-4 py-2.5"
                        >

                            <option value="">
                                Select Organization
                            </option>

                            {organizations.map(org => (

                                <option
                                    key={org.organization_id}
                                    value={org.organization_id}
                                >
                                    {org.name}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* CATEGORY */}

                    <div>

                        <label className="block text-sm font-medium mb-2">

                            Category

                        </label>


                        <select
                            value={categoryId}
                            onChange={(e) =>
                                setCategoryId(
                                    e.target.value
                                )
                            }
                            required
                            className="w-full border rounded-lg px-4 py-2.5"
                        >

                            <option value="">
                                Select Category
                            </option>

                            {categories

                                .filter(category =>
                                    !organizationId ||
                                    String(
                                        category.organization_id
                                    ) === String(
                                        organizationId
                                    )
                                )

                                .map(category => (

                                    <option
                                        key={category.category_id}
                                        value={category.category_id}
                                    >

                                        {category.name}

                                    </option>

                                ))

                            }

                        </select>

                    </div>


                    {/* SUBJECT */}

                    <div>

                        <label className="block text-sm font-medium mb-2">

                            Subject

                        </label>


                        <input
                            type="text"
                            value={subject}
                            onChange={(e) =>
                                setSubject(
                                    e.target.value
                                )
                            }
                            placeholder="Enter complaint subject"
                            required
                            className="w-full border rounded-lg px-4 py-2.5"
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div>

                        <label className="block text-sm font-medium mb-2">

                            Description

                        </label>


                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Describe your complaint"
                            required
                            rows="5"
                            className="w-full border rounded-lg px-4 py-2.5"
                        />

                    </div>


                    {/* PRIORITY */}

                    <div>

                        <label className="block text-sm font-medium mb-2">

                            Priority

                        </label>


                        <select
                            value={priority}
                            onChange={(e) =>
                                setPriority(
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg px-4 py-2.5"
                        >

                            <option value="Low">
                                Low
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="High">
                                High
                            </option>

                            <option value="Critical">
                                Critical
                            </option>

                        </select>

                    </div>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >

                        {submitting
                            ? "Submitting..."
                            : "Submit Complaint"
                        }

                    </button>

                </form>

            </div>


            {/* COMPLAINT LIST */}

            <div className="bg-white border rounded-xl overflow-hidden">

                <div className="px-6 py-5 border-b">

                    <h2 className="text-lg font-semibold">

                        {isUserPage
                            ? "My Complaints"
                            : "All Complaints"
                        }

                    </h2>

                </div>


                {complaints.length === 0 ? (

                    <div className="p-10 text-center text-gray-500">

                        {isUserPage
                            ? "You have not submitted any complaints yet."
                            : "No complaints found."
                        }

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


                                    {!isUserPage && (

                                        <th className="text-left px-6 py-4 text-sm">
                                            User
                                        </th>

                                    )}


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

                                    <th className="text-left px-6 py-4 text-sm">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {complaints.map(complaint => (

                                    <tr
                                        key={
                                            complaint.complaint_id
                                        }
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4">

                                            #{complaint.complaint_id}

                                        </td>


                                        <td className="px-6 py-4">

                                            {complaint.subject}

                                        </td>


                                        {!isUserPage && (

                                            <td className="px-6 py-4">

                                                {complaint.user_name}

                                            </td>

                                        )}


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
                                                status={
                                                    complaint.status
                                                }
                                            />

                                        </td>


                                        <td className="px-6 py-4">

                                            <Link
                                                to={
                                                    isUserPage
                                                        ? `/user/complaints/${complaint.complaint_id}`
                                                        : `/complaints/${complaint.complaint_id}`
                                                }
                                                className="text-blue-600 hover:underline text-sm font-medium"
                                            >

                                                View

                                            </Link>

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