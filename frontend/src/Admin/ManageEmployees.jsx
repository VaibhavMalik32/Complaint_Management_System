import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMatchingEmployees,
  transferEmployee,
  removeEmployee,
  getCurrentUser,
} from "../api";

const ManageEmployees = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    department: "",
    post: "",
  });
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [adminData, employeeData] = await Promise.all([
        getCurrentUser(),
        getMatchingEmployees(),
      ]);
      setAdmin(adminData);
      setEmployees(employeeData || []);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to load employee information."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleTransferClick = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      address: employee.address || "",
      city: employee.city || "",
      state: employee.state || "",
      department: admin?.department || employee.department || "",
      post: employee.post || "",
    });
    setShowTransfer(true);
    setError("");
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      return;
    }
    try {
      setTransferring(true);
      setError("");
      const transferData = {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        department: admin.department,
        post: formData.post,
      };
      await transferEmployee(
        selectedEmployee.user_id,
        transferData
      );
      alert("Employee transferred successfully.");
      setShowTransfer(false);
      setSelectedEmployee(null);
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to transfer employee."
      );
    } finally {
      setTransferring(false);
    }
  };
  const handleRemove = async (employeeId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this employee from their post?"
    );
    if (!confirmRemove) {
      return;
    }
    try {
      setError("");
      await removeEmployee(employeeId);
      alert("Employee removed from post successfully.");
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to remove employee."
      );
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">
          Loading employees...
        </p>
      </div>
    );
  }
  return (
    <div className="h-screen w-screen justify-center items-center flex">
        <div className="min-h-screen border rounded-2xl p-6">
        <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                Manage Employees
                </h1>
                {admin && (
                <p className="mt-2 text-sm text-black">
                    Department:{" "}
                    <span className="font-semibold">
                    {admin.department || "N/A"}
                    </span>
                </p>
                )}
            </div>
            <div className="flex gap-3">
                <button
                onClick={() => navigate("/admin/add-employee")}
                className="rounded-lg px-4 py-2 text-black border hover:bg-black hover:text-white"
                >
                + Add Employee
                </button>
                <button
                onClick={() => navigate("/admin")}
                className="rounded-lg px-4 py-2 text-black border hover:bg-black hover:text-white"
                >
                Back
                </button>
            </div>
            </div>
            {error && (
            <div className="mb-5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-600">
                {error}
            </div>
            )}
            {employees.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow">
                <p className="text-gray-500">
                No employees found.
                </p>
            </div>
            ) : (
            <div className="overflow-hidden rounded-xl bg-white shadow">
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                        ID
                        </th>
                        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                        Employee
                        </th>
                        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                        Email
                        </th>
                        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                        Department
                        </th>
                        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                        Post
                        </th>
                        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                        Location
                        </th>
                        <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                        Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {employees.map((employee) => (
                        <tr
                        key={employee.user_id}
                        className=""
                        >
                        <td className="px-5 py-4 text-sm text-gray-700">
                            {employee.user_id}
                        </td>
                        <td className="px-5 py-4">
                            <p className="font-medium text-gray-800">
                            {employee.full_name}
                            </p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                            {employee.email}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                            {employee.department || "N/A"}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                            {employee.post || "N/A"}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                            <p>{employee.city || "N/A"}</p>
                            <p className="text-xs text-gray-400">
                            {employee.state || "N/A"}
                            </p>
                        </td>
                        <td className="px-5 py-4">
                            <div className="flex justify-center gap-2">
                            <button
                                onClick={() =>
                                handleTransferClick(employee)
                                }
                                className="rounded-md border px-3 py-1.5 text-sm text-black hover:bg-black hover:text-white"
                            >
                                Transfer
                            </button>
                            <button
                                onClick={() =>
                                handleRemove(employee.user_id)
                                }
                                className="rounded-md border px-3 py-1.5 text-sm text-black hover:bg-black hover:text-white"
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
            </div>
            )}
            {showTransfer && selectedEmployee && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-6">
                    <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        Transfer Employee
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {selectedEmployee.full_name}
                    </p>
                    </div>
                    <button
                    onClick={() => {
                        setShowTransfer(false);
                        setSelectedEmployee(null);
                    }}
                    className="text-2xl text-gray-500 hover:text-gray-800"
                    >
                    ×
                    </button>
                </div>
                <form
                    onSubmit={handleTransfer}
                    className="p-6"
                >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                        Department
                        </label>
                        <input
                        type="text"
                        value={admin?.department || ""}
                        disabled
                        className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                        Post
                        </label>
                        <input
                        type="text"
                        name="post"
                        value={formData.post}
                        onChange={handleChange}
                        required
                        placeholder="Enter post"
                        className="w-full rounded-lg border px-3 py-2 outline-none"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                        City
                        </label>
                        <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-3 py-2 outline-none"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                        State
                        </label>
                        <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-3 py-2 outline-none"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                        Address
                        </label>
                        <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows="3"
                        placeholder="Enter employee address"
                        className="w-full rounded-lg border px-3 py-2 outline-none"
                        />
                    </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => {
                        setShowTransfer(false);
                        setSelectedEmployee(null);
                        }}
                        className="rounded-lg border px-5 py-2 text-black hover:bg-black hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={transferring || !admin?.department}
                        className="rounded-lg border px-5 py-2 text-black hover:bg-black hover:text-white"
                    >
                        {transferring
                        ? "Transferring..."
                        : "Transfer Employee"}
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

export default ManageEmployees;