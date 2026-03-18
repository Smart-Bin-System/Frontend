import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw } from "lucide-react";
import axiosClient from "@/lib/axios";

const fallbackAlerts = [
  {
    _id: "1",
    binId: "BIN-9F2A1C",
    area: "BCI Campus",
    type: "Bin Full",
    severity: "High",
    message: "Bin capacity exceeded 90%",
    createdAt: "2026-03-08 09:15 AM",
  },
  {
    _id: "2",
    binId: "BIN-1A7D4K",
    area: "Library Zone",
    type: "Device Offline",
    severity: "Medium",
    message: "No heartbeat received from device",
    createdAt: "2026-03-08 08:42 AM",
  },
  {
    _id: "3",
    binId: "BIN-7J4P8T",
    area: "Food Court",
    type: "Sync Delayed",
    severity: "Low",
    message: "Telemetry sync has been delayed",
    createdAt: "2026-03-08 08:10 AM",
  },
];

const getAlerts = async () => {
  const response = await axiosClient.get("/alerts");
  return response.data;
};

function getSeverityClass(severity) {
  switch (severity) {
    case "High":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "Medium":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function AlertsPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
  });

  const alerts = data?.data || data || fallbackAlerts;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Alerts</h2>
          <p className="mt-1 text-sm text-slate-500">
            Monitor critical operational notifications across the smart bin network
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Failed to load alerts from the API. Showing fallback sample data.
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading alerts...
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert._id || `${alert.binId}-${alert.createdAt}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-rose-100 p-3 text-rose-700">
                    <AlertTriangle className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">{alert.type}</h3>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getSeverityClass(alert.severity)}`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">{alert.message}</p>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span>
                        <strong className="text-slate-700">Bin:</strong> {alert.binId}
                      </span>
                      <span>
                        <strong className="text-slate-700">Area:</strong> {alert.area}
                      </span>
                      <span>
                        <strong className="text-slate-700">Time:</strong> {alert.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    View Bin
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
              No alerts found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AlertsPage;
