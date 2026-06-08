import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import InventoryPage from "./pages/InventoryPage";
import POSPage from "./pages/POSPage";
import RepairsPage from "./pages/RepairsPage";
import FinancePage from "./pages/FinancePage";
import UsersPage from "./pages/UsersPage";
import NotFound from "./pages/NotFound";
import { usePageTitle } from "./hooks/usePageTitle";

const getRolePath = (role) => (role === "admin" ? "/admin" : "/operator");

function App() {
  const { user } = useSelector((s) => s.auth);
  usePageTitle();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={getRolePath(user.role)} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* ── Admin ── */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />
        <Route path="/admin/pos" element={<POSPage />} />
        <Route path="/admin/repairs" element={<RepairsPage />} />
        <Route path="/admin/finance" element={<FinancePage />} />
        <Route path="/admin/users" element={<UsersPage />} />
      </Route>

      {/* ── Retail Operator ── */}
      <Route element={<ProtectedRoute allowedRoles={["retail_operator"]} />}>
        <Route path="/operator" element={<OperatorDashboard />} />
        <Route path="/operator/pos" element={<POSPage />} />
        <Route path="/operator/repairs" element={<RepairsPage />} />
        <Route path="/operator/transactions" element={<POSPage />} />
      </Route>

      <Route
        path="/"
        element={
          user ? (
            <Navigate to={getRolePath(user.role)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
