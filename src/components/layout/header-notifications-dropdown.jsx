import { BellRing, CheckCheck } from "lucide-react";
import { Link } from "react-router";

const notificationItems = [
  {
    id: 1,
    title: "Bin capacity exceeded threshold",
    description: "BIN-7J4P8T crossed 90% in Food Court.",
    time: "5 min ago",
  },
  {
    id: 2,
    title: "Device offline detected",
    description: "BIN-1A7D4K stopped telemetry updates.",
    time: "18 min ago",
  },
  {
    id: 3,
    title: "Area updated successfully",
    description: "Malabe Campus area details were modified.",
    time: "1 hr ago",
  },
];

function HeaderNotificationsDropdown({ open }) {
  if (!open) return null;

  return (
    <div className="absolute right-0 top-14 z-50 w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
          <p className="text-xs text-slate-500">Recent system activity</p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all read
        </button>
      </div>

      <div className="space-y-3">
        {notificationItems.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                <BellRing className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                <p className="mt-2 text-xs text-slate-400">{item.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/settings/notifications"
        className="mt-4 block rounded-xl border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        View all notifications
      </Link>
    </div>
  );
}

export default HeaderNotificationsDropdown;
