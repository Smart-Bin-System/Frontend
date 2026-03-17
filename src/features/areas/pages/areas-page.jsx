import { useState } from "react";
import { Link } from "react-router";
import { GitBranch, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import TableToolbar from "@/components/ui/table-toolbar";
import ActionMenu from "@/components/ui/action-menu";
import EmptyState from "@/components/ui/empty-state";
import PageSkeleton from "@/components/ui/page-skeleton";
import Toast from "@/components/ui/toast";
import { getAreas } from "@/features/areas/api/get-areas";

function AreasPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["areas"],
    queryFn: getAreas,
  });

  const allAreas = data?.data || [];

  const areas = allAreas.filter((area) => {
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
        description="Manage operational areas and hierarchy"
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
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {areas.map((area) => (
            <div
              key={area._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{area.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{area.code}</p>
                </div>

                <ActionMenu
                  items={[
                    {
                      label: "Edit",
                      icon: Pencil,
                      onClick: () => {},
                    },
                    {
                      label: "Delete",
                      icon: Trash2,
                      danger: true,
                      onClick: () => {},
                    },
                  ]}
                />
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <GitBranch className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wider">Parent Area</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {area.parentAreaId || "No parent area"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <span className="text-xs uppercase tracking-wider text-slate-500">Geo Fence</span>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {area.geoFence ? "Configured" : "Not configured"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
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
          ))}
        </div>
      )}
    </div>
  );
}

export default AreasPage;
