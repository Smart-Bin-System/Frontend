import { useQuery } from "@tanstack/react-query";
import { MapPinned, Plus, RefreshCw } from "lucide-react";
import { Link } from "react-router";
import axiosClient from "@/lib/axios";

const fallbackAreas = [
  {
    _id: "1",
    name: "Malabe Campus",
    description: "Main campus waste collection area",
    totalBins: 8,
    activeBins: 7,
  },
  {
    _id: "2",
    name: "Library Zone",
    description: "Library and study section",
    totalBins: 5,
    activeBins: 4,
  },
  {
    _id: "3",
    name: "Food Court",
    description: "Student food waste management area",
    totalBins: 6,
    activeBins: 5,
  },
];

const getAreas = async () => {
  const response = await axiosClient.get("/areas");
  return response.data;
};

function AreasPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["areas"],
    queryFn: getAreas,
  });

  const areas = data?.data || data || fallbackAreas;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Areas</h2>
          <p className="mt-1 text-sm text-slate-500">
            Configure operational zones and assign smart bins by area
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <Link
            to="/areas/new"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Area
          </Link>
        </div>
      </div>

      {isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Failed to load areas from the API. Showing fallback sample data.
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading areas...
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {areas.map((area) => {
            const uptime =
              area.totalBins > 0 ? Math.round((area.activeBins / area.totalBins) * 100) : 0;

            return (
              <div
                key={area._id || area.name}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                      <MapPinned className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{area.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {area.description || "No description available"}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {area.totalBins} bins
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Active</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{area.activeBins}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Uptime</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{uptime}%</p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Area health</span>
                    <span>{uptime}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${uptime}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}

          {areas.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
              No areas found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AreasPage;
