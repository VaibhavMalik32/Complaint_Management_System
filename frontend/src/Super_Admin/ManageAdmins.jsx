import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSuperAdminAdmins,
  transferAdmin,
  removeAdmin,
} from "../api";

const ManageAdmins = () => {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showTransfer, setShowTransfer] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [transferring, setTransferring] = useState(false);

  const [transferData, setTransferData] = useState({
    address: "",
    city: "",
    state: "",
    department: "",
    post: "",
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSuperAdminAdmins();
      setAdmins(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch admins.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const openTransferModal = (admin) => {
    setSelectedAdmin(admin);

    setTransferData({
      address: admin.address || "",
      city: admin.city || "",
      state: admin.state || "",
      department: admin.department || "",
      post: admin.post || "",
    });

    setShowTransfer(true);
    setError("");
  };

  const handleTransferChange = (e) => {
    setTransferData({
      ...transferData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!selectedAdmin) return;

    try {
      setTransferring(true);
      setError("");

      await transferAdmin(selectedAdmin.id, transferData);

      setShowTransfer(false);
      setSelectedAdmin(null);

      await fetchAdmins();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to transfer admin.");
    } finally {
      setTransferring(false);
    }
  };

  const handleRemove = async (admin) => {
    const confirmed = window.confirm(
      `Remove ${admin.full_name || admin.username} from the admin post?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await removeAdmin(admin.id);

      await fetchAdmins();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to remove admin.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">
          Loading admins...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen justify-center items-center flex bg-slate-50">
        <div className="min-h-screen p-6">
        <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-3xl font-bold text-black">
                Manage Admins
                </h1>
            </div>
            <div className="flex gap-3">
                <button
                onClick={() => navigate("/super-admin/add-admin")}
                className="rounded-lg border px-5 py-2.5 font-medium text-black hover:bg-black hover:text-white"
                >
                Add Admin
                </button>
                <button
                onClick={() => navigate("/super-admin")}
                className="rounded-lg px-5 py-2.5 font-medium text-black border hover:bg-black hover:text-white"
                >
                Back
                </button>
            </div>
            </div>
            {error && (
            <div className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-red-700">
                {error}
            </div>
            )}
            {admins.length === 0 ? (
            <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
                <p className="text-gray-500">
                No admins found.
                </p>
            </div>
            ) : (
            <div className="overflow-x-auto rounded-xl border bg-slate-50 shadow-sm">
                <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b bg-slate-100">
                    <th className="px-5 py-4 text-left">
                        ID
                    </th>

                    <th className="px-5 py-4 text-left">
                        Admin
                    </th>

                    <th className="px-5 py-4 text-left">
                        Email
                    </th>

                    <th className="px-5 py-4 text-left">
                        Department
                    </th>

                    <th className="px-5 py-4 text-left">
                        Post
                    </th>

                    <th className="px-5 py-4 text-left">
                        Location
                    </th>

                    <th className="px-5 py-4 text-left">
                        Actions
                    </th>
                    </tr>
                </thead>

                <tbody>
                    {admins.map((admin) => (
                    <tr
                        key={admin.id}
                        className="border-b"
                    >
                        <td className="px-5 py-4">
                        {admin.user_id}
                        </td>

                        <td className="px-5 py-4">
                        <div>
                            <p className="font-medium text-gray-800">
                            {admin.full_name}
                            </p>
                        </div>
                        </td>

                        <td className="px-5 py-4">
                        {admin.email}
                        </td>

                        <td className="px-5 py-4">
                        {admin.department || "N/A"}
                        </td>

                        <td className="px-5 py-4">
                        {admin.post || "N/A"}
                        </td>

                        <td className="px-5 py-4">
                        <div className="max-w-xs">
                            <p>
                            {admin.city || "N/A"},{" "}
                            {admin.state || "N/A"}
                            </p>

                            <p className="text-sm text-gray-500">
                            {admin.address || "N/A"}
                            </p>
                        </div>
                        </td>

                        <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                            onClick={() =>
                                openTransferModal(admin)
                            }
                            className="rounded-lg px-4 py-2 text-sm font-medium text-black border hover:bg-black hover:text-white"
                            >
                            Transfer
                            </button>

                            <button
                            onClick={() =>
                                handleRemove(admin)
                            }
                            className="rounded-lg px-4 py-2 text-sm font-medium text-black border hover:bg-black hover:text-white"
                            >
                            Remove
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
            {showTransfer && selectedAdmin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-2xl rounded-2xl bg-slate-50 p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                    <h2 className="text-2xl font-bold text-black">
                        Transfer Admin
                    </h2>
                    <p className="text-sm text-slate-700">
                        {selectedAdmin.full_name}
                    </p>
                    </div>
                    <button
                    onClick={() => setShowTransfer(false)}
                    className="text-2xl text-slate-500 hover:text-slate-800"
                    >
                    ×
                    </button>
                </div>

                <form onSubmit={handleTransfer}>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block font-medium text-black">
                        Department
                        </label>

                        <input
                        type="text"
                        value={transferData.department}
                        disabled
                        className="w-full rounded-lg border bg-slate-200 px-4 py-2.5 text-gray-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                        Department transfer is controlled by the
                        Super Admin.
                        </p>
                    </div>
                    <div>
                        <label className="mb-1 block font-medium text-black">
                        Post
                        </label>
                        <input
                        type="text"
                        name="post"
                        value={transferData.post}
                        onChange={handleTransferChange}
                        required
                        className="w-full rounded-lg border px-4 py-2.5 outline-none bg-slate-200"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block font-medium text-black">
                        City
                        </label>
                        <input
                        type="text"
                        name="city"
                        value={transferData.city}
                        onChange={handleTransferChange}
                        required
                        className="w-full rounded-lg border px-4 py-2.5 outline-none bg-slate-200"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block font-medium text-black">
                        State
                        </label>
                        <input
                        type="text"
                        name="state"
                        value={transferData.state}
                        onChange={handleTransferChange}
                        required
                        className="w-full rounded-lg border px-4 py-2.5 outline-none bg-slate-200"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="mb-1 block font-medium text-black">
                        Address
                        </label>

                        <textarea
                        name="address"
                        value={transferData.address}
                        onChange={handleTransferChange}
                        required
                        rows="3"
                        className="w-full rounded-lg border px-4 py-2.5 outline-none bg-slate-200"
                        />
                    </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setShowTransfer(false)}
                        className="rounded-lg px-5 py-2.5 font-medium text-black border hover:bg-black hover:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={transferring}
                        className="rounded-lg px-5 py-2.5 font-medium text-black border hover:bg-black hover:text-white"
                    >
                        {transferring
                        ? "Transferring..."
                        : "Transfer Admin"}
                    </button>
                    </div>

                </form>
                </div>
            </div>
            )}
        </div>
        </div>
    </div>
  );
};

export default ManageAdmins;