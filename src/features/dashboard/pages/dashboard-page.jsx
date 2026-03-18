import { AlertTriangle, CheckCircle2, Trash2, WifiOff } from "lucide-react";

const statCards = [
  {
    title: "Total Smart Bins",
    value: "24",
    change: "+3 this month",
    icon: Trash2,
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-700",
  },
  {
    title: "Online Bins",
    value: "19",
    change: "79% connectivity",
    icon: CheckCircle2,
    iconBg: "bg-sky-100",
    iconText: "text-sky-700",
  },
  {
    title: "Offline Bins",
    value: "5",
    change: "Needs attention",
    icon: WifiOff,
    iconBg: "bg-amber-100",
    iconText: "text-amber-700",
  },
  {
    title: "Critical Alerts",
    value: "7",
    change: "2 new today",
    icon: AlertTriangle,
    iconBg: "bg-rose-100",
    iconText: "text-rose-700",
  },
];

const recentAlerts = [
  {
    id: 1,
    bin: "BIN-9F2A1C",
    area: "BCI Campus",
    type: "Bin Full",
    severity: "High",
    time: "5 min ago",
  },
  {
    id: 2,
    bin: "BIN-1A7D4K",
    area: "Library Zone",
    type: "Device Offline",
    severity: "Medium",
    time: "18 min ago",
  },
  {
    id: 3,
    bin: "BIN-7J4P8T",
    area: "Food Court",
    type: "Sync Delayed",
    severity: "Low",
    time: "42 min ago",
  },
];

const areaStatus = [
  {
    area: "BCI Campus",
    bins: 8,
    active: 7,
    issues: 1,
  },
  {
    area: "Library Zone",
    bins: 5,
    active: 4,
    issues: 1,
  },
  {
    area: "Food Court",
    bins: 6,
    active: 5,
    issues: 2,
  },
  {
    area: "Hostel Block",
    bins: 5,
    active: 3,
    issues: 2,
  },
];

function severityClass(severity) {
  switch (severity) {
    case "High":
      return "bg-rose-100 text-rose-700";
    case "Medium":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>
                  <h3 className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</h3>
                  <p className="mt-2 text-sm text-slate-500">{card.change}</p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconText}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Alerts</h2>
              <p className="text-sm text-slate-500">
                Latest operational issues detected across smart bins
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-2 font-medium">Bin</th>
                  <th className="pb-2 font-medium">Area</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Severity</th>
                  <th className="pb-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentAlerts.map((alert) => (
                  <tr key={alert.id} className="rounded-xl bg-slate-50">
                    <td className="rounded-l-xl px-4 py-3 text-sm font-medium text-slate-900">
                      {alert.bin}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{alert.area}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{alert.type}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${severityClass(alert.severity)}`}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td className="rounded-r-xl px-4 py-3 text-sm text-slate-500">{alert.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Area Status Overview</h2>
          <p className="text-sm text-slate-500">Summary of area-wise smart bin availability</p>

          <div className="mt-5 space-y-4">
            {areaStatus.map((item) => (
              <div key={item.area} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{item.area}</h3>
                    <p className="mt-1 text-xs text-slate-500">{item.bins} total bins</p>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {item.active} active
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${(item.active / item.bins) * 100}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Issues: {item.issues}</span>
                  <span>Uptime: {Math.round((item.active / item.bins) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
