import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  const getRolePath = (role) => {
    if (role === "admin") return "/admin";
    if (role === "retail_operator") return "/operator";
    return "/login";
  };

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to={getRolePath(user.role)} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
