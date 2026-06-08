import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import InventoryPage from "./pages/InventoryPage";
import POSPage from "./pages/POSPage";
import NotFound from "./pages/NotFound";

const getRolePath = (role) => (role === "admin" ? "/admin" : "/operator");

function App() {
  const { user } = useSelector((s) => s.auth);

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

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />
        <Route path="/admin/pos" element={<POSPage />} />
      </Route>

      {/* Retail Operator routes */}
      <Route element={<ProtectedRoute allowedRoles={["retail_operator"]} />}>
        <Route path="/operator" element={<OperatorDashboard />} />
        <Route path="/operator/pos" element={<POSPage />} />
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
