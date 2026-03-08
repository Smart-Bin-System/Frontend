import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Search, Trash2, Wifi, WifiOff } from "lucide-react";
import { Link } from "react-router";
import axiosClient from "@/lib/axios";

const fallbackBins = [
  {
    _id: "1",
    publicId: "BIN-9F2A1C",
    name: "Main Entrance Bin",
    areaName: "Malabe Campus",
    status: "online",
    lastSeen: "2 min ago",
    fillLevel: 74,
  },
  {
    _id: "2",
    publicId: "BIN-1A7D4K",
    name: "Library Smart Bin",
    areaName: "Library Zone",
    status: "offline",
    lastSeen: "25 min ago",
    fillLevel: 32,
  },
  {
    _id: "3",
    publicId: "BIN-7J4P8T",
    name: "Food Court Bin",
    areaName: "Food Court",
    status: "online",
    lastSeen: "1 min ago",
    fillLevel: 91,
  },
];

const getBins = async () => {
  const response = await axiosClient.get("/bins");
  return response.data;
};

function getFillLevelClass(fillLevel) {
  if (fillLevel >= 85) return "bg-rose-500";
  if (fillLevel >= 60) return "bg-amber-500";
  return "bg-emerald-500";
}

function getStatusClass(status) {
  return status === "online" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";
}

function BinsPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["bins"],
    queryFn: getBins,
  });

  const bins = data?.data || data || fallbackBins;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Smart Bins</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage smart waste bins, connectivity, and fill levels
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search bins..."
              className="bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <Link
            to="/bins/new"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Add Bin
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading smart bins...</div>
        ) : isError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            Failed to load bins from the API. Showing fallback sample data.
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-4 font-medium">Public ID</th>
                <th className="px-4 py-4 font-medium">Name</th>
                <th className="px-4 py-4 font-medium">Area</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 font-medium">Fill Level</th>
                <th className="px-4 py-4 font-medium">Last Seen</th>
                <th className="px-4 py-4 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {bins.map((bin) => (
                <tr
                  key={bin._id || bin.publicId}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">{bin.publicId}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{bin.name}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {bin.areaName || bin.area?.name || "Unassigned"}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(bin.status)}`}
                    >
                      {bin.status === "online" ? (
                        <Wifi className="h-3.5 w-3.5" />
                      ) : (
                        <WifiOff className="h-3.5 w-3.5" />
                      )}
                      {bin.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-40">
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                        <span>{bin.fillLevel}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full ${getFillLevelClass(bin.fillLevel)}`}
                          style={{ width: `${bin.fillLevel}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500">{bin.lastSeen || "N/A"}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/bins/${bin._id || bin.publicId}`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Sync
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {bins.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-sm text-slate-500">
                    No bins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BinsPage;
