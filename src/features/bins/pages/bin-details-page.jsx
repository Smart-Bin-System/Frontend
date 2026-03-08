import { useMemo } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Cpu, MapPinned, RefreshCw, Trash2, Waypoints } from "lucide-react";
import axiosClient from "@/lib/axios";
import BinStatusBadge from "@/features/bins/components/bin-status-badge";

const fallbackBin = {
  _id: "1",
  publicId: "BIN-9F2A1C",
  name: "Main Entrance Bin",
  description: "Smart waste bin near the main entrance",
  status: "online",
  areaName: "Malabe Campus",
  fillLevel: 74,
  lastSeen: "2 min ago",
  device: {
    esp32ChipId: "ESP32-7A91X",
    firmwareVersion: "1.0.4",
    cnnModelVersion: "cnn-v2",
  },
  location: {
    address: "Main Entrance, Malabe Campus",
  },
  compartments: [
    { type: "PET", fillLevel: 82, status: "warning" },
    { type: "HDPE", fillLevel: 51, status: "normal" },
    { type: "LDPE", fillLevel: 35, status: "normal" },
    { type: "PP", fillLevel: 91, status: "critical" },
  ],
};

const getBinById = async (binId) => {
  const response = await axiosClient.get(`/bins/${binId}`);
  return response.data;
};

function getBarClass(fillLevel) {
  if (fillLevel >= 85) return "bg-rose-500";
  if (fillLevel >= 60) return "bg-amber-500";
  return "bg-emerald-500";
}

function BinDetailsPage() {
  const { binId } = useParams();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["bin", binId],
    queryFn: () => getBinById(binId),
    enabled: Boolean(binId),
  });

  const bin = useMemo(() => data?.data || data || fallbackBin, [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">{bin.publicId}</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">{bin.name}</h2>
          <p className="mt-2 text-sm text-slate-500">
            {bin.description || "No description available"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            type="button"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Sync Bin
          </button>
        </div>
      </div>

      {isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Failed to load this bin from the API. Showing fallback sample data.
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading bin details...
        </div>
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">Operational Status</h3>
                  <BinStatusBadge status={bin.status} />
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Fill Level</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{bin.fillLevel}%</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Area</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">
                      {bin.areaName || "Unassigned"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Last Seen</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">
                      {bin.lastSeen || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Overall fill level</span>
                    <span>{bin.fillLevel}%</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${getBarClass(bin.fillLevel)}`}
                      style={{ width: `${bin.fillLevel}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-slate-700" />
                  <h3 className="text-lg font-semibold text-slate-900">Compartment Overview</h3>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {bin.compartments?.map((compartment) => (
                    <div
                      key={compartment.type}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="text-sm font-semibold text-slate-900">{compartment.type}</h4>
                        <span className="text-xs font-medium text-slate-500">
                          {compartment.fillLevel}%
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full ${getBarClass(compartment.fillLevel)}`}
                          style={{ width: `${compartment.fillLevel}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-slate-700" />
                  <h3 className="text-lg font-semibold text-slate-900">Device Information</h3>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">ESP32 Chip ID</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {bin.device?.esp32ChipId || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Firmware Version
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {bin.device?.firmwareVersion || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      CNN Model Version
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {bin.device?.cnnModelVersion || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <MapPinned className="h-5 w-5 text-slate-700" />
                  <h3 className="text-lg font-semibold text-slate-900">Location</h3>
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Address</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {bin.location?.address || "No address available"}
                  </p>
                </div>

                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  Map preview can be added here later
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Waypoints className="h-5 w-5 text-slate-700" />
                  <h3 className="text-lg font-semibold text-slate-900">Actions</h3>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Edit Bin
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                  >
                    Remove Bin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BinDetailsPage;
