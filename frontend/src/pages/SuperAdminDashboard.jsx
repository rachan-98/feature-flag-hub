import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [name, setName] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchOrganizations = async () => {
    try {
      const res = await API.get("/organizations");
      setOrganizations(res.data.data || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to load organizations");
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Organization name is required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await API.post("/organizations", {
        name: name.trim(),
      });

      setName("");
      setMessage("Organization created successfully");
      fetchOrganizations();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to create organization");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm px-8 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            🚀 Feature Flag Hub
          </h1>
          <p className="text-gray-500">Super Admin Dashboard</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <section className="bg-white rounded-3xl shadow p-8">
          <h2 className="text-2xl font-bold mb-2">Create Organization</h2>
          <p className="text-gray-500 mb-6">
            Super Admin creates organizations. Organization admins will use the
            organization slug during signup.
          </p>

          {message && (
            <div className="bg-blue-50 text-blue-700 rounded-xl p-3 mb-5">
              {message}
            </div>
          )}

          <form onSubmit={handleCreate} className="flex gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: Byepo Technologies"
              className="border rounded-xl p-3 flex-1"
            />

            <button
              disabled={loading}
              className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-3xl shadow p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Organizations</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left p-4">Organization Name</th>
                  <th className="text-left p-4">Slug</th>
                  <th className="text-left p-4">Created</th>
                </tr>
              </thead>

              <tbody>
                {organizations.map((org) => (
                  <tr key={org._id} className="border-b">
                    <td className="p-4 font-semibold">{org.name}</td>
                    <td className="p-4 text-gray-600">{org.slug}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {organizations.length === 0 && (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan="3">
                      No organizations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SuperAdminDashboard;