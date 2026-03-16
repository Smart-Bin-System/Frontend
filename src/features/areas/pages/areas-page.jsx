import { useState } from "react";
import { Link } from "react-router";
import { MapPinned, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import TableToolbar from "@/components/ui/table/table-toolbar";
import ActionMenu from "@/components/ui/action-menu";
import EmptyState from "@/components/ui/empty-state";
import PageSkeleton from "@/components/ui/page-skeleton";

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

function AreasPage() {
  const [search, setSearch] = useState("");
  const [loading] = useState(false);

  const areas = fallbackAreas.filter((area) => {
    return (
      area.name.toLowerCase().includes(search.toLowerCase()) ||
      area.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) {
    return <PageSkeleton cards={3} rows={4} />;
  }

  return (
    <div className="space-y-6">
      <TableToolbar
        title="Areas"
        description="Configure operational zones and assign smart bins by area"
        searchPlaceholder="Search areas..."
        searchValue={search}
        onSearchChange={(event) => setSearch(event.target.value)}
        actions={
          <>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
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
          icon={MapPinned}
          title="No areas found"
          description="Try adjusting your search or create a new operational area."
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
          {areas.map((area) => {
            const uptime =
              area.totalBins > 0 ? Math.round((area.activeBins / area.totalBins) * 100) : 0;

            return (
              <div
                key={area._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                      <MapPinned className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{area.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{area.description}</p>
                    </div>
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

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Total Bins</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{area.totalBins}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Active Bins</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{area.activeBins}</p>
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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AreasPage;
