import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createEmployee,
  getCurrentUser,
  sendOTP,
  verifyOTP,
} from "../api";

const AddEmployee = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    department: "",
    post: "",
  });

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const data = await getCurrentUser();

        setAdmin(data);

        setFormData((prev) => ({
          ...prev,
          department: data.department || "",
        }));
      } catch (err) {
        console.error(err);

        setError(
          err.message || "Failed to fetch admin information."
        );
      } finally {
        setLoadingAdmin(false);
      }
    };

    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // If email is changed after verification,
    // it must be verified again.
    if (name === "email") {
      setEmailVerified(false);
      setShowOTP(false);
      setOtp("");
    }
  };

  // Send OTP
  const handleSendOTP = async () => {
    setError("");
    setMessage("");

    if (!formData.email) {
      setError("Please enter the employee email first.");
      return;
    }

    try {
      const data = await sendOTP(formData.email);

      setShowOTP(true);
      setMessage(data.message);
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    setError("");
    setMessage("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const data = await verifyOTP(
        formData.email,
        otp
      );

      setEmailVerified(true);
      setShowOTP(false);
      setMessage(data.message);
    } catch (err) {
      setError(err.message || "Invalid OTP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    if (!emailVerified) {
      setError(
        "Please verify the employee email before creating the employee."
      );
      setLoading(false);
      return;
    }

    try {
      await createEmployee(formData);

      setMessage("Employee created successfully.");

      setFormData({
        username: "",
        full_name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        department: admin?.department || "",
        post: "",
      });

      setOtp("");
      setShowOTP(false);
      setEmailVerified(false);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to create employee."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading admin information...
        </p>
      </div>
    );
  }
console.log("FORM DATA:", formData);
console.log("EMAIL VERIFIED:", emailVerified);
  return (
    <div className="h-screen w-screen justify-center items-center flex mt-20">
        <div className="min-h-screen border rounded-2xl p-6">
        <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                Add Employee
                </h1>
            </div>
            <button
                onClick={() => navigate("/admin")}
                className="cursor-pointer rounded-lg border px-4 py-2 text-black hover:bg-black hover:text-white"
            >
                Back
            </button>
            </div>
            {message && (
            <div className="mb-5 rounded-lg bg-green-100 p-3 text-green-700">
                {message}
            </div>
            )}
            {error && (
            <div className="mb-5 rounded-lg bg-red-100 p-3 text-red-700">
                {error}
            </div>
            )}

            <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-white p-6"
            >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Username
                </label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter username"
                    className="w-full rounded-lg border px-3 py-2 outline-none"
                />
                </div>
                <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name
                </label>

                <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                    className="w-full rounded-lg border px-3 py-2 outline-none"
                />
                </div>
                <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                </label>
                <div className="flex items-center gap-2">
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter employee email"
                    className="w-full rounded-lg border px-3 py-2 outline-none"
                    />
                    {!emailVerified ? (
                    <button
                        type="button"
                        onClick={handleSendOTP}
                        className="h-10 shrink-0 cursor-pointer rounded-lg border px-4 text-sm hover:bg-black hover:text-white"
                    >
                        Verify
                    </button>
                    ) : (
                    <span className="shrink-0 text-sm font-semibold text-green-500">
                        ✓ Verified
                    </span>
                    )}
                </div>
                </div>
                {showOTP && !emailVerified && (
                <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                    Enter OTP
                    </label>
                    <div className="flex gap-2">
                    <input
                        type="text"
                        value={otp}
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        onChange={(e) => {
                        const value = e.target.value;

                        if (/^\d*$/.test(value)) {
                            setOtp(value);
                        }
                        }}
                        className="w-48 rounded-lg border px-3 py-2 outline-none"
                    />

                    <button
                        type="button"
                        onClick={handleVerifyOTP}
                        className="cursor-pointer rounded-lg border px-4 py-2 text-sm hover:bg-black hover:text-white"
                    >
                        Verify OTP
                    </button>
                    </div>
                </div>
                )}
                <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                    className="w-full rounded-lg border px-3 py-2 outline-none"
                />
                </div>
                <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone
                </label>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength="10"
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border px-3 py-2 outline-none"
                />
                </div>
                <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Department
                </label>

                <input
                    type="text"
                    value={formData.department}
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
                    placeholder="Enter employee post"
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
                    placeholder="Enter city"
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
                    placeholder="Enter state"
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

            <div className="mt-6 flex justify-end">
                <button
                type="submit"
                disabled={
                    loading ||
                    !formData.department ||
                    !emailVerified
                }
                className="cursor-pointer rounded-lg border px-6 py-2.5 text-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                >
                {loading ? "Creating..." : "Create Employee"}
                </button>
            </div>
            </form>
        </div>
        </div>
    </div>
  );
};

export default AddEmployee;