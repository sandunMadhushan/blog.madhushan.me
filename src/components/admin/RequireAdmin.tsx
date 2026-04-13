import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function RequireAdmin() {
  const { admin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Checking admin session...</p>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
