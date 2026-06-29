import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function OrgAdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [flags, setFlags] = useState([]);
  const [form, setForm] = useState({
    featureKey: "",
    description: "",
    isEnabled: true,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFlags = async () => {
    try {
      const res = await API.get("/feature-flags");
      setFlags(res.data.data || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to load feature flags");
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.featureKey.trim()) {
      setMessage("Feature key is required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await API.post("/feature-flags", {
        featureKey: form.featureKey.trim(),
        description: form.description.trim(),
        isEnabled: form.isEnabled,
      });

      setForm({
        featureKey: "",
        description: "",
        isEnabled: true,
      });

      setMessage("Feature flag created successfully");
      fetchFlags();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to create feature flag");
    } finally {
      setLoading(false);
    }
  };

  const toggleFlag = async (flag) => {
    try {
      await API.put(`/feature-flags/${flag._id}`, {
        isEnabled: !flag.isEnabled,
      });

      fetchFlags();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to update feature flag");
    }
  };

  const deleteFlag = async (flagId) => {
    const confirmDelete = window.confirm("Delete this feature flag?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/feature-flags/${flagId}`);
      setMessage("Feature flag deleted successfully");
      fetchFlags();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to delete feature flag");
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
            Feature Flags
          </h1>
          <p className="text-gray-500">
            Organization: {user?.organization?.name || "Your Organization"}
          </p>
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
          <h2 className="text-2xl font-bold mb-2">Create Feature Flag</h2>
          <p className="text-gray-500 mb-6">
            Add feature switches for your organization.
          </p>

          {message && (
            <div className="bg-blue-50 text-blue-700 rounded-xl p-3 mb-5">
              {message}
            </div>
          )}

          <form onSubmit={handleCreate} className="grid gap-4">
            <input
              name="featureKey"
              value={form.featureKey}
              onChange={handleChange}
              placeholder="Feature key, example: dark_mode"
              className="border rounded-xl p-3"
            />

            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="border rounded-xl p-3"
            />

            <label className="flex items-center gap-3 font-semibold">
              <input
                type="checkbox"
                name="isEnabled"
                checked={form.isEnabled}
                onChange={handleChange}
              />
              Enabled
            </label>

            <button
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700"
            >
              {loading ? "Creating..." : "Create Feature Flag"}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-3xl shadow p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Feature Flags</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left p-4">Feature Key</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {flags.map((flag) => (
                  <tr key={flag._id} className="border-b">
                    <td className="p-4 font-semibold">{flag.featureKey}</td>
                    <td className="p-4 text-gray-600">
                      {flag.description || "-"}
                    </td>
                    <td className="p-4">
                      <span
                        className={
                          flag.isEnabled
                            ? "bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold"
                            : "bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold"
                        }
                      >
                        {flag.isEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => toggleFlag(flag)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                      >
                        Toggle
                      </button>

                      <button
                        onClick={() => deleteFlag(flag._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {flags.length === 0 && (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan="4">
                      No feature flags found.
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

export default OrgAdminDashboard;