import { Link } from "react-router";
import { LogOut, Settings, ShieldCheck, UserCircle2, Users } from "lucide-react";

function HeaderProfileDropdown({ open }) {
  if (!open) return null;

  return (
    <div className="absolute right-0 top-14 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Mihashi</p>
        <p className="mt-1 text-xs text-slate-500">mihashi@example.com</p>
        <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          System Administrator
        </span>
      </div>

      <div className="mt-3 space-y-1">
        <Link
          to="/settings/profile"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          <UserCircle2 className="h-4 w-4" />
          Profile
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>

        <Link
          to="/settings/users"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          <Users className="h-4 w-4" />
          Users
        </Link>

        <Link
          to="/settings/roles"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          <ShieldCheck className="h-4 w-4" />
          Roles
        </Link>
      </div>

      <div className="mt-3 border-t border-slate-200 pt-3">
        <button
          type="button"
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
