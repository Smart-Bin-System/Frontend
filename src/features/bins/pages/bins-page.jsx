import { useState } from "react";
import { Link } from "react-router";
import { Pencil, RefreshCw, Trash2, Wifi, WifiOff } from "lucide-react";
import TableToolbar from "@/components/ui/table/table-toolbar";
import ActionMenu from "@/components/ui/action-menu";
import DataTableEmpty from "@/components/ui/table/data-table-empty";
import PageSkeleton from "@/components/ui/page-skeleton";

const fallbackBins = [
  {
    _id: "1",
    publicId: "BIN-9F2A1C",
    name: "Main Entrance Bin",
    areaName: "BCI Campus",
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

function getFillLevelClass(fillLevel) {
  if (fillLevel >= 85) return "bg-rose-500";
  if (fillLevel >= 60) return "bg-amber-500";
  return "bg-emerald-500";
}

function getStatusClass(status) {
  return status === "online" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";
}

function BinsPage() {
  const [search, setSearch] = useState("");
  const [loading] = useState(false);

  const bins = fallbackBins.filter((bin) => {
    return (
      bin.publicId.toLowerCase().includes(search.toLowerCase()) ||
      bin.name.toLowerCase().includes(search.toLowerCase()) ||
      bin.areaName.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) {
    return <PageSkeleton cards={4} rows={5} />;
  }

  return (
    <div className="space-y-6">
      <TableToolbar
        title="Smart Bins"
        description="Manage smart waste bins, connectivity, and fill levels"
        searchPlaceholder="Search bins..."
        searchValue={search}
        onSearchChange={(event) => setSearch(event.target.value)}
        actions={
          <>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <Link
              to="/bins/new"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Add Bin
            </Link>
          </>
        }
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {bins.length === 0 ? (
          <DataTableEmpty
            title="No bins found"
            description="Try adjusting your search or add a new smart bin."
          />
        ) : (
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
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                      {bin.publicId}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{bin.name}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{bin.areaName}</td>
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
                    <td className="px-4 py-4 text-sm text-slate-500">{bin.lastSeen}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/bins/${bin._id}`}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          View
                        </Link>

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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BinsPage;
