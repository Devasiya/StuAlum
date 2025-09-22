import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/login", formData);
      // You can store the token in localStorage or context if needed
      // localStorage.setItem('token', res.data.token);
      alert("Logged in successfully!");
      // navigate to dashboard or home
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg p-2"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg p-2"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Not Registered */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Not registered yet?</p>
          <div className="flex justify-center space-x-3 mt-3">
            <button
              onClick={() => navigate("/student-register")}
              className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Student
            </button>
            <button
              onClick={() => navigate("/alumni-register")}
              className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Alumni
            </button>
            <button
              onClick={() => navigate("/admin-register")}
              className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;