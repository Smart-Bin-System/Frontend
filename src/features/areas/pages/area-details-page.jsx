import { Link, useParams } from "react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPinned, Pencil, Plus, Trash2 } from "lucide-react";
import axiosClient from "@/lib/axios";
import PageHeader from "@/components/ui/page-header";
import SectionCard from "@/components/ui/card/section-card";
import ConfirmModal from "@/components/ui/modal/confirm-modal";
import Toast from "@/components/ui/toast";
import BinStatusBadge from "@/features/bins/components/bin-status-badge";

const fallbackArea = {
  _id: "1",
  name: "Malabe Campus",
  description: "Main campus smart waste collection area",
  address: "Malabe main academic zone",
  totalBins: 8,
  activeBins: 7,
  bins: [
    {
      _id: "b1",
      publicId: "BIN-9F2A1C",
      name: "Main Entrance Bin",
      status: "online",
      fillLevel: 74,
    },
    {
      _id: "b2",
      publicId: "BIN-1A7D4K",
      name: "Library Smart Bin",
      status: "offline",
      fillLevel: 32,
    },
  ],
};

const getAreaById = async (areaId) => {
  const response = await axiosClient.get(`/areas/${areaId}`);
  return response.data;
};

function getFillClass(fillLevel) {
  if (fillLevel >= 85) return "bg-rose-500";
  if (fillLevel >= 60) return "bg-amber-500";
  return "bg-emerald-500";
}

function AreaDetailsPage() {
  const { areaId } = useParams();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["area", areaId],
    queryFn: () => getAreaById(areaId),
    enabled: Boolean(areaId),
  });

  const area = useMemo(() => data?.data || data || fallbackArea, [data]);

  const uptime = area.totalBins > 0 ? Math.round((area.activeBins / area.totalBins) * 100) : 0;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Loading area details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showToast ? (
        <Toast
          variant="warning"
          title="UI-only delete flow"
          description="Delete action is prepared in the interface and will be wired later."
        />
      ) : null}

      <PageHeader
        eyebrow="Area Details"
        title={area.name}
        description={area.description || "No description available"}
        breadcrumbs={[{ label: "Areas", to: "/areas" }, { label: area.name }]}
        actions={
          <>
            <Link
              to={`/areas/${areaId}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" />
              Edit Area
            </Link>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add Bin
            </button>
          </>
        }
      />

      {isError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Failed to load this area from the API. Showing fallback sample data.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <SectionCard
            title="Assigned Smart Bins"
            description="All smart bins currently linked to this operational area"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-4 font-medium">Public ID</th>
                    <th className="px-4 py-4 font-medium">Name</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 font-medium">Fill Level</th>
                    <th className="px-4 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {area.bins?.map((bin) => (
                    <tr key={bin._id} className="border-b border-slate-100 last:border-b-0">
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                        {bin.publicId}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{bin.name}</td>
                      <td className="px-4 py-4">
                        <BinStatusBadge status={bin.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-36">
                          <div className="mb-1 flex justify-between text-xs text-slate-500">
                            <span>{bin.fillLevel}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className={`h-full rounded-full ${getFillClass(bin.fillLevel)}`}
                              style={{ width: `${bin.fillLevel}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          to={`/bins/${bin._id}`}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          View Bin
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {(!area.bins || area.bins.length === 0) && (
                    <tr>
                      <td colSpan="5" className="px-4 py-10 text-center text-sm text-slate-500">
                        No bins assigned to this area yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Area Overview">
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPinned className="h-4 w-4" />
                  <p className="text-sm font-medium">Address</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {area.address || "No address available"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Total Bins</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{area.totalBins}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Active Bins</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{area.activeBins}</p>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Area uptime</span>
                  <span>{uptime}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${uptime}%` }}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Area Actions">
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/areas/${areaId}/edit`}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Edit Area
              </Link>

              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
              >
                <span className="inline-flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Area
                </span>
              </button>
            </div>
          </SectionCard>
        </div>
      </div>

      <ConfirmModal
        open={deleteOpen}
        title="Delete area"
        description={`Are you sure you want to delete ${area.name}? This action is currently UI-only and will be wired later.`}
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          setDeleteOpen(false);
          setShowToast(true);
        }}
      />
    </div>
  );
}

export default AreaDetailsPage;
