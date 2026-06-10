import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}) {
  const isAdmin =
    localStorage.getItem("adminToken") ===
    "ROAD_WARRIOR_ADMIN_2026";

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
}