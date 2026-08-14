import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Cpu, MapPinned, RefreshCw, Trash2, Waypoints, X } from "lucide-react";
import BinStatusBadge from "@/features/bins/components/bin-status-badge";
import ConfirmModal from "@/components/ui/modal/confirm-modal";
import PageHeader from "@/components/ui/page-header";
import { getBinById } from "@/features/bins/api/get-bin-by-id";
import { deleteBin } from "@/features/bins/api/delete-bin";
import { syncBin } from "@/features/bins/api/sync-bin";
import { getFillLevelColor, getPlasticChartColor } from "@/constants/chart-colors";

function BinDetailsPage() {
  const { binId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pairingCode, setPairingCode] = useState("");
  const [pairingCodeOpen, setPairingCodeOpen] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["bin", binId],
    queryFn: () => getBinById(binId),
    enabled: Boolean(binId),
  });

  const bin = useMemo(() => {
    return data || null;
  }, [data]);

  const safeBin = bin || {
    publicId: "N/A",
    name: "Unknown Bin",
    description: "",
    status: "offline",
    fillLevel: 0,
    lastSeen: "N/A",
    areaName: "Unassigned",
    compartments: [],
    device: {},
    location: {},
  };

  const isSynced = String(safeBin.pairing?.status || "").toLowerCase() === "paired";

  const syncMutation = useMutation({
    mutationFn: syncBin,
    onSuccess: (response) => {
      const nextCode = response?.data?.code || response?.code || "";
      setPairingCode(nextCode);
      setPairingCodeOpen(Boolean(nextCode));
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      queryClient.invalidateQueries({ queryKey: ["bin", binId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      queryClient.invalidateQueries({ queryKey: ["bin", binId] });
      navigate("/bins");
    },
  });

  const handlePrimaryAction = () => {
    if (isSynced) {
      navigate(`/bins/${binId}/edit`);
      return;
    }

    syncMutation.mutate(binId);
  };

  return (
    <div className="space-y-6">
      {deleteMutation.isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {deleteMutation.error?.response?.data?.message ||
            "Failed to delete bin. Please try again."}
        </div>
      ) : null}

      {syncMutation.isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {syncMutation.error?.response?.data?.message || "Failed to sync bin. Please try again."}
        </div>
      ) : null}

      <PageHeader
        eyebrow={safeBin.publicId}
        title={safeBin.name}
        description={safeBin.description || "No description available"}
        breadcrumbs={[{ label: "Bins", to: "/bins" }, { label: safeBin.name || "Bin" }]}
        actions={
          <>
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
              onClick={handlePrimaryAction}
              disabled={syncMutation.isPending}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              {isSynced ? "Edit Bin" : syncMutation.isPending ? "Syncing..." : "Sync Bin"}
            </button>
          </>
        }
      />

      {isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Failed to load this bin from the API.
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
                  <BinStatusBadge status={safeBin.status} />
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Fill Level</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                      {safeBin.fillLevel}%
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Area</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">
                      {safeBin.areaName || "Unassigned"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Last Seen</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">
                      {safeBin.lastSeen || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Overall fill level</span>
                    <span>{safeBin.fillLevel}%</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full transition-colors"
                      style={{
                        width: `${safeBin.fillLevel}%`,
                        backgroundColor: getFillLevelColor(safeBin.fillLevel),
                      }}
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
                  {safeBin.compartments?.map((compartment) => (
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
                          className="h-full rounded-full transition-colors"
                          style={{
                            width: `${compartment.fillLevel}%`,
                            backgroundColor: getPlasticChartColor(compartment.type),
                          }}
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
                      {safeBin.device?.esp32ChipId || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Firmware Version
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {safeBin.device?.firmwareVersion || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      CNN Model Version
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {safeBin.device?.cnnModelVersion || "N/A"}
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
                    {safeBin.location?.address || "No address available"}
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
                    onClick={handlePrimaryAction}
                    disabled={syncMutation.isPending}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    {isSynced ? "Edit Bin" : syncMutation.isPending ? "Syncing..." : "Sync Bin"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteOpen(true)}
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

      <ConfirmModal
        open={deleteOpen}
        title="Delete bin"
        description={`Are you sure you want to delete ${safeBin.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteMutation.mutate(binId);
        }}
      />

      {pairingCodeOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Pairing Code Ready</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Use this code on the ESP32 pairing flow before it expires.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPairingCodeOpen(false)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                Pairing Code
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-[0.2em] text-emerald-700">
                {pairingCode}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setPairingCodeOpen(false)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BinDetailsPage;
