import { NavLink } from "react-router";
import {
  BarChart3,
  BellRing,
  Gauge,
  LayoutDashboard,
  Map,
  Settings,
  Trash2,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Areas", to: "/areas", icon: Map },
  { label: "Bins", to: "/bins", icon: Trash2 },
  { label: "Telemetry", to: "/telemetry", icon: Gauge },
  { label: "Alerts", to: "/alerts", icon: BellRing },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Settings", to: "/settings", icon: Settings },
];

function Sidebar({ mobileOpen = false, onClose }) {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
        />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto border-r border-slate-800 bg-slate-950 text-slate-100 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-6 lg:block">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Mihashi Smart Bin logo"
              className="h-12 w-12 rounded-2xl object-contain"
            />
            <div>
              <h2 className="text-base font-semibold">Mihashi Smart Bin</h2>
              <p className="text-xs text-slate-400">Waste Management Console</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-900 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-800 p-4">
          <div className="rounded-2xl bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">System Status</p>
            <p className="mt-2 text-sm font-semibold text-white">Monitoring active smart bins</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              All core services operational
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
