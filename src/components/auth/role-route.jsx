import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { hasAnyPermission } from "@/lib/rbac";

function RoleRoute({ requiredPermissions = [] }) {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm">
          Loading access...
        </div>
      </div>
    );
  }

  if (!hasAnyPermission(user, requiredPermissions)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
