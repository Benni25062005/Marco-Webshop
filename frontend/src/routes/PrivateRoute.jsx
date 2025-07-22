import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return null;

  return user ? children : <Navigate to="/login" replace />;
}
