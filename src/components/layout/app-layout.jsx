import { Outlet, useLocation } from "react-router";
import Sidebar from "@/components/layout/sidebar";
import { Bell, Search } from "lucide-react";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/areas": "Areas",
  "/bins": "Bins",
  "/telemetry": "Telemetry",
  "/alerts": "Alerts",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

function AppLayout() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Smart Waste Management";

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="min-h-screen lg:ml-72">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                  Mihashi&apos;s Smart Waste Management System
                </p>
                <h1 className="text-2xl font-semibold text-slate-900">{pageTitle}</h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
                  <Search className="h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search bins, areas, alerts..."
                    className="w-60 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50"
                >
                  <Bell className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                    M
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium text-slate-900">Mihashi</p>
                    <p className="text-xs text-slate-500">System Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
