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
      localStorage.setItem("role", data.role);
      if (data.role === "admin") {
        navigate("/admin");
      } 
      else if(data.role === "super_admin"){
        navigate("/super-admin");
      }
      else if(data.role === "employee"){
        navigate("/employee");
      }
      else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex bg-stone-50 min-h-screen">
      <div className="h-120 w-full justify-center items-center flex ml-20">
        <div>
          <h1 className="text-4xl font-bold text-stone-800">Complaint Management System</h1><br />
          <h1 className="text-xl">A centralized platform for efficient complaint management and resolution.</h1><br />
          <p>Access your account to submit complaints, track their progress, view updates, and monitor actions taken toward resolution.</p><br />
          <ol className="list-disc ml-4">
            <li>Submit and Track Complaints</li>
            <li>View Complaint Status and History</li>
            <li>Monitor Actions and Resolution</li>
          </ol>
        </div>
      </div>
      <div className="h-full w-full justify-center items-center flex mt-25">
        <div className="h-100 w-100 border rounded-2xl bg-slate-100">
          <h1 className="text-center font-bold text-3xl mt-5 text-stone-800">
            Login
          </h1>
          <div className="h-60 justify-center items-center flex">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-70 outline rounded mb-2 pl-3 bg-stone-50"
              />
              <br />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-70 outline rounded mb-2 pl-3 bg-stone-50"
              />
              <br />
              <button
                type="submit"
                className="cursor-pointer w-70 h-10 rounded outline hover:bg-black hover:text-white bg-stone-50"
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
    </div>
  );
}

export default Login;