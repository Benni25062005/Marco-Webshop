import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAdmin() {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />; // lässt geschützte Admin-Routen durch
}
