import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { loginUser } from "../api.js";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const data = await loginUser(username, password);

      localStorage.setItem("access_token", data.access_token);

      navigate("/home");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-full w-full justify-center items-center flex mt-25">

      <div className="h-100 w-100 border rounded-2xl">

        <h1 className="text-center font-bold text-3xl mt-5">
          Login
        </h1>

        <div className="h-60 justify-center items-center flex">

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-70 outline rounded mb-2 pl-3"
            />

            <br />

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-70 outline rounded mb-2 pl-3"
            />

            <br />

            <button
              type="submit"
              className="cursor-pointer w-70 h-10 rounded outline"
            >
              Login
            </button>

          </form>

        </div>

        {error && (
          <p className="text-red-500 text-center">
            {error}
          </p>
        )}

        <div className="text-center mt-4">
          Don't have an account?{" "}
          <NavLink to="/register" className="text-blue-500">
            Register
          </NavLink>
        </div>

      </div>

    </div>
  );
}

export default Login;