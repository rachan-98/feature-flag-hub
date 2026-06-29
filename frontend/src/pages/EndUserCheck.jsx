import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";

function EndUserCheck() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    organizationSlug: "byepo-technologies",
    featureKey: "dark_mode",
  });

  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheck = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setResult(null);

      const res = await API.post("/feature-flags/check", form);

      setResult(res.data.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to check feature");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-xl">
        <h1 className="text-4xl font-bold text-purple-700">
          End User Feature Check
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Check whether a feature is enabled for an organization.
        </p>

        {message && (
          <div className="bg-red-100 text-red-700 rounded-xl p-3 mb-5">
            {message}
          </div>
        )}

        <form onSubmit={handleCheck} className="space-y-5">
          <div>
            <label className="font-semibold">Organization Slug</label>
            <input
              name="organizationSlug"
              value={form.organizationSlug}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
              placeholder="example: byepo-technologies"
            />
          </div>

          <div>
            <label className="font-semibold">Feature Key</label>
            <input
              name="featureKey"
              value={form.featureKey}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
              placeholder="example: dark_mode"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white rounded-xl p-3 font-bold hover:bg-purple-700"
          >
            {loading ? "Checking..." : "Check Feature"}
          </button>
        </form>

        {result && (
          <div className="mt-8 border rounded-2xl p-6 bg-slate-50">
            <p className="text-gray-500">Feature Status</p>

            <h2
              className={
                result.isEnabled
                  ? "text-4xl font-bold text-green-600 mt-2"
                  : "text-4xl font-bold text-red-600 mt-2"
              }
            >
              {result.status.toUpperCase()}
            </h2>

            <p className="mt-4">
              <strong>Organization:</strong> {result.organization}
            </p>

            <p>
              <strong>Feature:</strong> {result.featureKey}
            </p>
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="w-full mt-5 text-gray-500 hover:text-gray-800"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default EndUserCheck;