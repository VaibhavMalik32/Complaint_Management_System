import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAdmin,
  sendOTP,
  verifyOTP,
} from "../api";

const AddAdmin = () => {
  const navigate = useNavigate();
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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "email") {
      setEmailVerified(false);
      setShowOTP(false);
      setOtp("");
    }
  };
  const handleSendOTP = async () => {
    setError("");
    setMessage("");
    if (!formData.email) {
      setError("Please enter the admin email first.");
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
    setMessage("");
    setError("");
    if (!emailVerified) {
      setError(
        "Please verify the admin email before creating the admin."
      );
      setLoading(false);
      return;
    }
    try {
      await createAdmin(formData);
      setMessage("Admin created successfully.");
      setFormData({
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
      setOtp("");
      setShowOTP(false);
      setEmailVerified(false);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to create admin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-green-50 p-6">
      <div className="w-full max-w-4xl rounded-2xl border bg-green-100 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800">
              Create Admin
            </h1>
          </div>

          <button
            onClick={() => navigate("/super-admin")}
            className="cursor-pointer rounded-lg border px-5 py-2.5 text-black hover:bg-black hover:text-white"
          >
            Back
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-lg bg-green-100 px-4 py-3 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl p-2 bg-green-100"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium text-green-700">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter username"
                className="w-full rounded-lg border px-4 py-2.5 outline-none bg-green-200"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-green-700">
                Full Name
              </label>

              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className="w-full rounded-lg border px-4 py-2.5 outline-none bg-green-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block font-medium text-green-700">
                Email
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter admin email"
                  className="w-full rounded-lg border px-4 py-2.5 outline-none bg-green-200"
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
                <label className="mb-1 block font-medium text-green-700">
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
                    className="w-48 rounded-lg border px-3 py-2 outline-none bg-green-200"
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
              <label className="mb-1 block font-medium text-green-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="w-full rounded-lg border px-4 py-2.5 outline-none bg-green-200"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-green-700">
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
                className="w-full rounded-lg border px-4 py-2.5 outline-none bg-green-200"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-green-700">
                Department
              </label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-2.5 outline-none text-black bg-green-200"
              >
                <option value="">
                  Select Department
                </option>

                <option value="Crime">
                  Crime
                </option>

                <option value="IT">
                  IT
                </option>

                <option value="Electricity">
                  Electricity
                </option>

                <option value="Water">
                  Water
                </option>

                <option value="Public Works">
                  Public Works
                </option>

                <option value="Municipal">
                  Municipal
                </option>

                <option value="Environment">
                  Environment
                </option>

                <option value="Administration">
                  Administration
                </option>

                <option value="Finance">
                  Finance
                </option>

                <option value="Consumer Affairs">
                  Consumer Affairs
                </option>
              </select>
            </div>
            <div>
              <label className="mb-1 block font-medium text-green-700">
                Post
              </label>

              <input
                type="text"
                name="post"
                value={formData.post}
                onChange={handleChange}
                required
                placeholder="e.g. Department Admin"
                className="w-full rounded-lg border px-4 py-2.5 outline-none bg-green-200"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-green-700">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Enter city"
                className="w-full rounded-lg border px-4 py-2.5 outline-none bg-green-200"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-green-700">
                State
              </label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="Enter state"
                className="w-full rounded-lg border px-4 py-2.5 outline-none bg-green-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block font-medium text-green-700">
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Enter admin address"
                className="w-full rounded-lg border px-4 py-2.5 outline-none bg-green-200"
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
              className="cursor-pointer rounded-lg border px-6 py-3 font-medium text-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;