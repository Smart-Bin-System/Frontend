import { Link, useParams } from "react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GitBranch, Pencil, Plus, Trash2 } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import SectionCard from "@/components/ui/card/section-card";
import ConfirmModal from "@/components/ui/modal/confirm-modal";
import Toast from "@/components/ui/toast";
import { getAreaById } from "@/features/areas/api/get-area-by-id";
import { deleteArea } from "@/features/areas/api/delete-area";

function AreaDetailsPage() {
  const { areaId } = useParams();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["area", areaId],
    queryFn: () => getAreaById(areaId),
    enabled: Boolean(areaId),
  });

  const area = useMemo(() => data?.data || null, [data]);

  const deleteMutation = useMutation({
    mutationFn: () => deleteArea(areaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      window.location.href = "/areas";
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Loading area details...
      </div>
    );
  }

  if (isError || !area) {
    return (
      <Toast
        variant="error"
        title="Failed to load area"
        description="The requested area could not be loaded."
      />
    );
  }

  return (
    <div className="space-y-6">
      {deleteMutation.isError ? (
        <Toast
          variant="error"
          title="Failed to delete area"
          description={
            deleteMutation.error?.response?.data?.message ||
            deleteMutation.error?.message ||
            "Please try again."
          }
        />
      ) : null}

      <PageHeader
        eyebrow="Area Details"
        title={area.name}
        description={`Area code: ${area.code}`}
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

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Area Information">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <span className="text-xs uppercase tracking-wider text-slate-500">Name</span>
              <p className="mt-2 text-sm font-medium text-slate-900">{area.name}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <span className="text-xs uppercase tracking-wider text-slate-500">Code</span>
              <p className="mt-2 text-sm font-medium text-slate-900">{area.code}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 md:col-span-2">
              <div className="flex items-center gap-2 text-slate-500">
                <GitBranch className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Parent Area</span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {area.parentAreaId || "No parent area"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 md:col-span-2">
              <span className="text-xs uppercase tracking-wider text-slate-500">Geo Fence</span>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {area.geoFence ? "Configured" : "Not configured"}
              </p>
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

      <ConfirmModal
        open={deleteOpen}
        title="Delete area"
        description={`Are you sure you want to delete ${area.name}?`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </div>
  );
}

export default AreaDetailsPage;
