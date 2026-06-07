import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import NotFound from "./pages/NotFound";
import InventoryPage from "./pages/InventoryPage";
import POSPage from "./pages/POSPage";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={
          user ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />
        }
      />

      {/* Admin-only routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />
        <Route path="/admin/pos" element={<POSPage />} />
      </Route>

      {/* Technician-only routes */}
      <Route element={<ProtectedRoute allowedRoles={["technician"]} />}>
        <Route path="/technician" element={<TechnicianDashboard />} />
      </Route>

      {/* Cashier-only routes */}
      <Route element={<ProtectedRoute allowedRoles={["cashier"]} />}>
        <Route path="/cashier" element={<CashierDashboard />} />
        <Route path="/cashier/pos" element={<POSPage />} />
      </Route>

      {/* Root redirect */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={`/${user.role}`} replace />
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
