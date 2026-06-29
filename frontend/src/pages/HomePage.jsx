import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center px-6">
      <div className="bg-white p-12 rounded-3xl shadow-xl w-full max-w-5xl text-center">
        <h1 className="text-6xl font-bold text-blue-700">
          🚀 Feature Flag Hub
        </h1>

        <p className="text-xl mt-6 text-gray-500">
          Multi-Tenant Feature Flag Management Platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <button
            onClick={() => navigate("/super-admin")}
            className="bg-blue-600 text-white rounded-2xl p-10 hover:scale-105 transition"
          >
            <h2 className="text-3xl font-bold">Super Admin</h2>
            <p className="mt-3">Manage Organizations</p>
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="bg-green-600 text-white rounded-2xl p-10 hover:scale-105 transition"
          >
            <h2 className="text-3xl font-bold">Organization</h2>
            <p className="mt-3">Manage Feature Flags</p>
          </button>

          <button
            onClick={() => navigate("/user")}
            className="bg-purple-600 text-white rounded-2xl p-10 hover:scale-105 transition"
          >
            <h2 className="text-3xl font-bold">End User</h2>
            <p className="mt-3">Check Feature</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;