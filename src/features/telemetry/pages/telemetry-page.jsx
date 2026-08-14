import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Filter, RefreshCw, Search, Signal } from "lucide-react";
import BinStatusBadge from "@/features/bins/components/bin-status-badge";
import { getTelemetry } from "@/features/telemetry/api/get-telemetry";
import { getFillLevelColor } from "@/constants/chart-colors";

function TelemetryPage() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("today");

  const normalizedSearch = useMemo(() => search.trim(), [search]);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["telemetry", period, normalizedSearch],
    queryFn: () => getTelemetry({ period, search: normalizedSearch }),
    refetchInterval: 15000,
  });

  const telemetryItems = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Telemetry</h2>
          <p className="mt-1 text-sm text-slate-500">
            Real-time monitoring of device health and recent smart bin activity
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by bin name or id..."
              className="bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-emerald-500"
            >
              <option value="today">Today</option>
              <option value="3days">Last 3 Days</option>
              <option value="week">This Week</option>
            </select>
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
      </div>

      {isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Failed to load telemetry from the API. Please try again.
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
                    className="h-full rounded-full transition-colors"
                    style={{
                      width: `${item.fillLevel}%`,
                      backgroundColor: getFillLevelColor(item.fillLevel),
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {telemetryItems.length === 0 ? (
            <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
              No telemetry data found for the selected filters.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default TelemetryPage;
