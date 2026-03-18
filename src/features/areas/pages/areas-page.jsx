import { useState } from "react";
import { Link } from "react-router";
import { GitBranch, Layers3, MapPinned, Plus, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import TableToolbar from "@/components/ui/table/table-toolbar";
import EmptyState from "@/components/ui/empty-state";
import PageSkeleton from "@/components/ui/page-skeleton";
import Toast from "@/components/ui/toast";
import StatusCard from "@/components/ui/card/status-card";
import AreaHierarchy from "@/features/areas/components/area-hierarchy";
import { getAreas } from "@/features/areas/api/get-areas";
import { buildAreaTree, flattenAreaTree } from "@/features/areas/utils/area-tree";

function getParentName(area, allAreas) {
  if (!area?.parentAreaId) return "Root Area";

  if (typeof area.parentAreaId === "object" && area.parentAreaId?.name) {
    return area.parentAreaId.name;
  }

  const parent = allAreas.find((item) => item._id === area.parentAreaId);
  return parent?.name || "Parent Linked";
}

function AreasPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["areas"],
    queryFn: getAreas,
  });

  const allAreas = data?.data || [];
  const roots = buildAreaTree(allAreas);
  const flattened = flattenAreaTree(roots);

  const areas = flattened.filter((area) => {
    const name = area.name || "";
    const code = area.code || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      code.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (isLoading) {
    return <PageSkeleton cards={3} rows={4} />;
  }

  return (
    <div className="space-y-6">
      {isError ? (
        <Toast
          variant="error"
          title="Failed to load areas"
          description={error?.response?.data?.message || error?.message || "Please try again."}
        />
      ) : null}

      <TableToolbar
        title="Areas"
        description="Manage operational areas, hierarchy, and geofence zones"
        searchPlaceholder="Search areas..."
        searchValue={search}
        onSearchChange={(event) => setSearch(event.target.value)}
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

            <Link
              to="/areas/new"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add Area
            </Link>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          title="Total Areas"
          value={String(allAreas.length)}
          description="Registered operational areas"
          icon={MapPinned}
          iconClassName="bg-emerald-100 text-emerald-700"
        />
        <StatusCard
          title="Root Areas"
          value={String(roots.length)}
          description="Top-level areas"
          icon={Layers3}
          iconClassName="bg-sky-100 text-sky-700"
        />
        <StatusCard
          title="Hierarchy Nodes"
          value={String(flattened.length)}
          description="Visible in tree structure"
          icon={GitBranch}
          iconClassName="bg-amber-100 text-amber-700"
        />
        <StatusCard
          title="Geofenced Areas"
          value={String(allAreas.filter((a) => a.geoFence).length)}
          description="Areas with polygon boundaries"
          icon={MapPinned}
          iconClassName="bg-violet-100 text-violet-700"
        />
      </div>

      {areas.length === 0 ? (
        <EmptyState
          title="No areas found"
          description="Try adjusting your search or create a new area."
          action={
            <Link
              to="/areas/new"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add Area
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Area Hierarchy</h3>
              <p className="mt-1 text-sm text-slate-500">
                Parent-child structure of operational zones
              </p>
            </div>

            <AreaHierarchy areas={allAreas} />
          </div>

          <div className="space-y-4">
            {areas.map((area) => (
              <div
                key={area._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                      {area.level === 0 ? "Root Area" : `Level ${area.level + 1}`}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-900">{area.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">Code: {area.code}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/areas/${area._id}`}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      View
                    </Link>

                    <Link
                      to={`/areas/${area._id}/edit`}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Edit
                    </Link>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <span className="text-xs uppercase tracking-wider text-slate-500">
                      Parent Area
                    </span>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {getParentName(area, allAreas)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <span className="text-xs uppercase tracking-wider text-slate-500">
                      Geo Fence
                    </span>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {area.geoFence ? "Configured" : "Not configured"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AreasPage;
