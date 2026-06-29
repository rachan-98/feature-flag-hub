import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import OrgAdminLogin from "./pages/OrgAdminLogin";
import OrgAdminDashboard from "./pages/OrgAdminDashboard";
import EndUserCheck from "./pages/EndUserCheck";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/super-admin" element={<SuperAdminLogin />} />
      <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
      <Route path="/admin" element={<OrgAdminLogin />} />
      <Route path="/admin/dashboard" element={<OrgAdminDashboard />} />
      <Route path="/user" element={<EndUserCheck />} />
    </Routes>
  );
}

export default App;