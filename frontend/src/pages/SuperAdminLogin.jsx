import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function SuperAdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "superadmin@featurehub.com",
    password: "admin123",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/super-admin/login", form);

      login(res.data.data);
      navigate("/super-admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-bold text-slate-900">Super Admin</h1>

        <p className="text-gray-500 mt-2 mb-8">
          Login to create and view organizations.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 rounded-xl p-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-semibold">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-xl p-3 font-bold hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 text-gray-500 hover:text-gray-800"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default SuperAdminLogin;