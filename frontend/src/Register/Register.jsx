import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser } from "../api.js";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      await registerUser(formData);

      setSuccess("Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-full w-full justify-center items-center flex mt-25">
      <div className="h-120 w-100 border rounded-2xl">
        <div>
          <h1 className="text-center font-bold text-3xl mt-5">
            Register Form
          </h1>

          <div className="h-70 justify-center items-center flex">
            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                className="w-70 outline rounded mb-2 pl-3"
              />
              <br />

              <input
                type="text"
                name="full_name"
                placeholder="Enter full name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-70 outline rounded mb-2 pl-3"
              />
              <br />

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="w-70 outline rounded mb-2 pl-3"
              />
              <br />

              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="w-70 outline rounded mb-2 pl-3"
              />
              <br />

              <button
                type="submit"
                className="cursor-pointer w-70 h-10 rounded outline hover:bg-black hover:text-white"
              >
                Register
              </button>

            </form>
          </div>

          {error && (
            <p className="text-red-500 text-center">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-500 text-center">
              {success}
            </p>
          )}

          <div className="text-center mt-4">
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