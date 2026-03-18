import { useQuery } from "@tanstack/react-query";
import { Activity, RefreshCw, Signal } from "lucide-react";
import axiosClient from "@/lib/axios";
import BinStatusBadge from "@/features/bins/components/bin-status-badge";

const fallbackTelemetry = [
  {
    _id: "1",
    publicId: "BIN-9F2A1C",
    area: "BCI Campus",
    status: "online",
    lastSeen: "10 sec ago",
    temperature: "31°C",
    signalStrength: "Strong",
    fillLevel: 74,
  },
  {
    _id: "2",
    publicId: "BIN-1A7D4K",
    area: "Library Zone",
    status: "offline",
    lastSeen: "25 min ago",
    temperature: "N/A",
    signalStrength: "Weak",
    fillLevel: 32,
  },
  {
    _id: "3",
    publicId: "BIN-7J4P8T",
    area: "Food Court",
    status: "online",
    lastSeen: "22 sec ago",
    temperature: "29°C",
    signalStrength: "Good",
    fillLevel: 91,
  },
];

const getTelemetry = async () => {
  const response = await axiosClient.get("/telemetry/get");
  return response.data;
};

function TelemetryPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["telemetry"],
    queryFn: getTelemetry,
    refetchInterval: 15000,
  });

  const telemetryItems = data?.data || data || fallbackTelemetry;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Telemetry</h2>
          <p className="mt-1 text-sm text-slate-500">
            Real-time monitoring of device health and recent smart bin activity
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
          Failed to load telemetry from the API. Showing fallback sample data.
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading telemetry...
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {telemetryItems.map((item) => (
            <div
              key={item._id || item.publicId}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-emerald-600">{item.publicId}</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">{item.area}</h3>
                </div>

                <BinStatusBadge status={item.status} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Activity className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wider">Last Seen</span>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{item.lastSeen}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Signal className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wider">Signal</span>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{item.signalStrength}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Temperature</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{item.temperature}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Fill Level</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{item.fillLevel}%</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Bin capacity usage</span>
                  <span>{item.fillLevel}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${
                      item.fillLevel >= 85
                        ? "bg-rose-500"
                        : item.fillLevel >= 60
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                    style={{ width: `${item.fillLevel}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TelemetryPage;
