import { BellRing, CheckCheck, Filter } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import SectionCard from "@/components/ui/card/section-card";
import EmptyState from "@/components/ui/empty-state";

const notifications = [
  {
    id: 1,
    title: "Bin capacity exceeded threshold",
    description: "BIN-7J4P8T has crossed 90% fill level in Food Court.",
    time: "5 min ago",
    type: "alert",
  },
  {
    id: 2,
    title: "Device offline detected",
    description: "BIN-1A7D4K has stopped sending telemetry updates.",
    time: "18 min ago",
    type: "warning",
  },
  {
    id: 3,
    title: "Area updated successfully",
    description: "BCI Campus area information was updated.",
    time: "1 hr ago",
    type: "info",
  },
];

function getTypeClass(type) {
  switch (type) {
    case "alert":
      return "bg-rose-100 text-rose-700";
    case "warning":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-sky-100 text-sky-700";
  }
}

function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="System Activity"
        title="Notifications"
        description="Review recent system notifications and operational updates."
        breadcrumbs={[{ label: "Settings", to: "/settings" }, { label: "Notifications" }]}
        actions={
          <>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </button>
          </>
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={BellRing}
          title="No notifications"
          description="System notifications will appear here when events occur."
        />
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => (
            <SectionCard key={item.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                    <BellRing className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getTypeClass(
                          item.type,
                        )}`}
                      >
                        {item.type}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                  </div>
                </div>

                <span className="text-sm text-slate-500">{item.time}</span>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
