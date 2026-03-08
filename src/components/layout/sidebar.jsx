import { NavLink } from "react-router";
import {
  BarChart3,
  BellRing,
  Boxes,
  Gauge,
  LayoutDashboard,
  Map,
  Settings,
  Trash2,
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

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 overflow-y-auto border-r border-slate-800 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
      <div className="border-b border-slate-800 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
            <Boxes className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Mihashi Smart Bin</h2>
            <p className="text-xs text-slate-400">Waste Management Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-5">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
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

      <div className="border-t border-slate-800 p-4">
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
  );
}

export default Sidebar;
