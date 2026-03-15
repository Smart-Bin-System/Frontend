import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import HeaderNotificationsDropdown from "@/components/layout/header-notifications-dropdown";
import HeaderProfileDropdown from "@/components/layout/header-profile-dropdown";
import { Bell, Menu, Search } from "lucide-react";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/areas": "Areas",
  "/bins": "Bins",
  "/telemetry": "Telemetry",
  "/alerts": "Alerts",
  "/analytics": "Analytics",
  "/settings": "Settings",
  "/settings/profile": "Profile",
  "/settings/notifications": "Notifications",
  "/settings/users": "Users",
  "/settings/roles": "Roles & Permissions",
  "/settings/security": "Security",
  "/settings/appearance": "Appearance",
};

function AppLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const pageTitle = pageTitles[location.pathname] || "Smart Waste Management";

  useEffect(() => {
    setNotificationsOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="min-h-screen lg:ml-72">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                    Mihashi&apos;s Smart Waste Management System
                  </p>
                  <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{pageTitle}</h1>
                </div>
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

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationsOpen((prev) => !prev);
                      setProfileOpen(false);
                    }}
                    className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50"
                  >
                    <Bell className="h-5 w-5" />
                  </button>

                  <HeaderNotificationsDropdown open={notificationsOpen} />
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen((prev) => !prev);
                      setNotificationsOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                      M
                    </div>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-medium text-slate-900">Mihashi</p>
                      <p className="text-xs text-slate-500">System Admin</p>
                    </div>
                  </button>

                  <HeaderProfileDropdown open={profileOpen} />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
