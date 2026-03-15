import { Link, useNavigate } from "react-router";
import { LogOut, Settings, ShieldCheck, UserCircle2, Users } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { PERMISSIONS } from "@/constants/permissions";
import { hasPermission } from "@/lib/rbac";
import { ROLE_LABELS } from "@/constants/roles";

function HeaderProfileDropdown({ open }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!open) return null;

  const userRoleLabel = ROLE_LABELS[user?.role] || "User";

  return (
    <div className="absolute right-0 top-14 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">{user?.name || "User"}</p>
        <p className="mt-1 text-xs text-slate-500">{user?.email || "user@example.com"}</p>
        <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {userRoleLabel}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        {hasPermission(user, PERMISSIONS.VIEW_PROFILE) && (
          <Link
            to="/settings/profile"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <UserCircle2 className="h-4 w-4" />
            Profile
          </Link>
        )}

        {hasPermission(user, PERMISSIONS.VIEW_SETTINGS) && (
          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        )}

        {hasPermission(user, PERMISSIONS.VIEW_USERS) && (
          <Link
            to="/settings/users"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <Users className="h-4 w-4" />
            Users
          </Link>
        )}

        {hasPermission(user, PERMISSIONS.VIEW_ROLES) && (
          <Link
            to="/settings/roles"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <ShieldCheck className="h-4 w-4" />
            Roles
          </Link>
        )}
      </div>

      <div className="mt-3 border-t border-slate-200 pt-3">
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-50"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default HeaderProfileDropdown;
