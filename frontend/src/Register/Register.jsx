import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  registerUser,
  sendOTP,
  verifyOTP,
} from "../api.js";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const usernameValid = /^(?=.*[A-Za-z0-9])[A-Za-z0-9._@-]+$/.test(
    formData.username
  );

  const passwordRules = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const passwordValid =
    passwordRules.length &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.special;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "email") {
      setEmailVerified(false);
      setShowOTP(false);
      setOtp("");
    }

    if (e.target.name === "username" || e.target.name === "password") {
      setError("");
    }
  };

  const handleSendOTP = async () => {
    setError("");
    setSuccess("");

    if (!formData.email) {
      setError("Please enter your email first.");
      return;
    }

    try {
      const data = await sendOTP(formData.email);
      setShowOTP(true);
      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOTP = async () => {
    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const data = await verifyOTP(formData.email, otp);

      setEmailVerified(true);
      setShowOTP(false);
      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!usernameValid) {
      setError(
        "Username can contain letters, numbers, ., _, @ and -, and must contain at least one letter or number."
      );
      return;
    }

    if (!passwordValid) {
      setError("Please satisfy all password requirements.");
      return;
    }

    if (!emailVerified) {
      setError("Please verify your email before registering.");
      return;
    }

    try {
      await registerUser(formData);

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex">
      <div className="h-120 w-full justify-center items-center flex ml-20">
        <div>
          <h1 className="text-4xl font-bold ">
            Complaint Management System
          </h1>
          <br />
          <h1 className="text-xl">
            A centralized platform to submit, manage and track complaints efficiently.
          </h1>
          <br />
          <p>
            Our Complaint Management System provides a simple and organized way for users to register complaints, track their status, and receive updates until resolution.
          </p>
          <br />
          <ul className="list-disc ml-4">
            <li>
              Submit Complaints - Register complaints with relevant details and supporting images.
            </li>
            <li>
              Track Progress - Monitor the status and history of complaints.
            </li>
            <li>
              Department Management - Complaints are handled by the appropriate departments and assigned employees.
            </li>
            <li>
              Resolution - View actions taken and track complaints through resolution.
            </li>
          </ul>
        </div>
      </div>

      <div className="h-120 w-full justify-center items-center flex mt-25">
        <div className="h-auto w-100 border rounded-2xl p-5">
          <h1 className="text-center font-bold text-3xl mt-2 mb-6">
            Register Form
          </h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className="w-70 outline rounded mb-3 pl-3 h-9"
              required
            />
            <br />

            {formData.username && !usernameValid && (
              <p className="text-red-500 text-sm mb-3 w-70">
                Username must contain at least one letter or number and can contain letters, numbers, ., _, @ and -.
              </p>
            )}

            {formData.username && usernameValid && (
              <p className="text-green-500 text-sm mb-3">
                ✓ Valid username
              </p>
            )}

            <input
              type="text"
              name="full_name"
              placeholder="Enter full name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-70 outline rounded mb-3 pl-3 h-9"
              required
            />
            <br />

            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="w-70 outline rounded mb-3 pl-3 h-9"
                required
              />

              {!emailVerified ? (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="w-21 h-9 rounded outline cursor-pointer text-sm hover:bg-black hover:text-white"
                >
                  Verify
                </button>
              ) : (
                <span className="text-green-500 text-sm font-semibold">
                  ✓ Verified
                </span>
              )}
            </div>

            {showOTP && !emailVerified && (
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^\d*$/.test(value)) {
                      setOtp(value);
                    }
                  }}
                  maxLength={6}
                  className="w-47 outline rounded pl-3 h-9"
                />

                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  className="ml-2 w-21 h-9 rounded outline cursor-pointer text-sm hover:bg-black hover:text-white"
                >
                  Verify OTP
                </button>
              </div>
            )}

            <br />

            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-70 outline rounded mb-3 pl-3 h-9"
              required
            />
            <br />

            <input
              type="text"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              className="w-70 outline rounded mb-3 pl-3 h-9"
              required
            />
            <br />

            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              className="w-70 outline rounded mb-3 pl-3 h-9"
              required
            />
            <br />

            <input
              type="text"
              name="state"
              placeholder="Enter state"
              value={formData.state}
              onChange={handleChange}
              className="w-70 outline rounded mb-3 pl-3 h-9"
              required
            />
            <br />

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-70 outline rounded mb-3 pl-3 h-9"
              required
            />
            <br />

            {formData.password && (
              <div className="w-70 mb-4 text-sm">
                <p className={passwordRules.length ? "text-green-500" : "text-red-500"}>
                  {passwordRules.length ? "✓" : "✗"} Minimum 8 characters
                </p>

                <p className={passwordRules.uppercase ? "text-green-500" : "text-red-500"}>
                  {passwordRules.uppercase ? "✓" : "✗"} At least one uppercase letter
                </p>

                <p className={passwordRules.lowercase ? "text-green-500" : "text-red-500"}>
                  {passwordRules.lowercase ? "✓" : "✗"} At least one lowercase letter
                </p>

                <p className={passwordRules.special ? "text-green-500" : "text-red-500"}>
                  {passwordRules.special ? "✓" : "✗"} At least one special character
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!usernameValid || !passwordValid}
              className="cursor-pointer w-70 h-10 rounded outline hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Register
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-center mt-4">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-500 text-center mt-4">
              {success}
            </p>
          )}

          <div className="text-center mt-5">
            Already have an account?{" "}
            <NavLink to="/login" className="text-blue-500">
              Login
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;