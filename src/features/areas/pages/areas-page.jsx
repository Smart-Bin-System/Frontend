import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  GitBranch,
  Layers3,
  MapPinned,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import TableToolbar from "@/components/ui/table/table-toolbar";
import EmptyState from "@/components/ui/empty-state";
import PageSkeleton from "@/components/ui/page-skeleton";
import Toast from "@/components/ui/toast";
import StatusCard from "@/components/ui/card/status-card";
import { getAreas } from "@/features/areas/api/get-areas";
import { buildAreaTree } from "@/features/areas/utils/area-tree";

function getParentName(area, allAreas) {
  if (!area?.parentAreaId) return "No parent";

  if (typeof area.parentAreaId === "object" && area.parentAreaId?.name) {
    return area.parentAreaId.name;
  }

  const parent = allAreas.find((item) => item._id === area.parentAreaId);
  return parent?.name || "Parent Linked";
}

function getHierarchyType(depth) {
  if (depth === 0) return "Province";
  if (depth === 1) return "District";
  if (depth === 2) return "City";
  return `Level ${depth + 1}`;
}

function getTypeStyles(depth) {
  if (depth === 0) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (depth === 1) {
    return "border-sky-200 bg-sky-50 text-sky-700";
  }
  if (depth === 2) {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function flattenTreeByDepth(nodes, depth = 0) {
  let result = [];

  for (const node of nodes) {
    result.push({
      ...node,
      hierarchyDepth: depth,
    });

    if (node.children?.length) {
      result = result.concat(flattenTreeByDepth(node.children, depth + 1));
    }
  }

  return result;
}

function filterTree(nodes, predicate) {
  return nodes
    .map((node) => {
      const filteredChildren = filterTree(node.children || [], predicate);
      const selfMatches = predicate(node);

      if (selfMatches || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
        };
      }

      return null;
    })
    .filter(Boolean);
}

function HierarchyNode({ area, depth = 0, allAreas, expandedIds, onToggle }) {
  const children = area.children || [];
  const hasChildren = children.length > 0;
  const isExpanded = expandedIds.has(area._id);
  const typeLabel = getHierarchyType(depth);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-start justify-between gap-3 p-4">
          <button
            type="button"
            onClick={() => hasChildren && onToggle(area._id)}
            className="flex min-w-0 flex-1 items-start gap-3 text-left"
          >
            {hasChildren ? (
              <div className="mt-0.5 rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-500">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            ) : null}

            <div className="min-w-0 flex-1">
              <div
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getTypeStyles(depth)}`}
              >
                {typeLabel}
              </div>

              <h3 className="mt-3 text-base font-semibold text-slate-900">{area.name}</h3>

              <p className="mt-1 text-sm text-slate-500">Code: {area.code}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                {depth > 0 ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">
                    Parent: {getParentName(area, allAreas)}
                  </span>
                ) : null}

                {hasChildren ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">
                    {children.length} {children.length === 1 ? "child" : "children"}
                  </span>
                ) : null}
              </div>
            </div>
          </button>

          <div className="flex shrink-0 gap-2">
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

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            hasChildren && isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            {hasChildren ? (
              <div className="border-t border-slate-100 bg-slate-50/70 p-4">
                <div className="space-y-3">
                  {children.map((child) => (
                    <div
                      key={child._id}
                      className={`ml-2 pl-3 ${
                        depth === 0 ? "border-l-2 border-sky-100" : "border-l-2 border-violet-100"
                      }`}
                    >
                      <HierarchyNode
                        area={child}
                        depth={depth + 1}
                        allAreas={allAreas}
                        expandedIds={expandedIds}
                        onToggle={onToggle}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function AreasPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedIds, setExpandedIds] = useState(new Set());

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["areas"],
    queryFn: getAreas,
  });

  const allAreas = data?.data || [];
  const roots = useMemo(() => buildAreaTree(allAreas), [allAreas]);
  const flattened = useMemo(() => flattenTreeByDepth(roots), [roots]);

  const provinceCount = flattened.filter((area) => area.hierarchyDepth === 0).length;
  const districtCount = flattened.filter((area) => area.hierarchyDepth === 1).length;
  const divisionCount = flattened.filter((area) => area.hierarchyDepth === 2).length;

  const filteredAreas = useMemo(() => {
    return flattened.filter((area) => {
      const matchesSearch =
        (area.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (area.code || "").toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "all" ? true : String(area.hierarchyDepth) === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [flattened, search, typeFilter]);

  const filteredRoots = useMemo(() => {
    const predicate = (node) => {
      const searchMatch =
        (node.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (node.code || "").toLowerCase().includes(search.toLowerCase());

      if (typeFilter === "all") return searchMatch;

      const tempFlat = flattenTreeByDepth([node]);
      const current = tempFlat[0];

      return searchMatch && String(current.hierarchyDepth) === typeFilter;
    };

    if (!search && typeFilter === "all") {
      return roots;
    }

    return filterTree(roots, predicate);
  }, [roots, search, typeFilter]);

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
        description="Manage provinces, districts, and secretariat divisions"
        searchPlaceholder="Search by area name or code..."
        searchValue={search}
        onSearchChange={(event) => setSearch(event.target.value)}
        actions={
          <>
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-emerald-500"
              >
                <option value="all">All Area Types</option>
                <option value="0">Provinces</option>
                <option value="1">Districts</option>
                <option value="2">Cities</option>
              </select>
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
              to="/areas/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
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
          description="All registered administrative areas"
          icon={MapPinned}
          iconClassName="bg-emerald-100 text-emerald-700"
        />
        <StatusCard
          title="Provinces"
          value={String(provinceCount)}
          description="Top-level administrative areas"
          icon={Layers3}
          iconClassName="bg-sky-100 text-sky-700"
        />
        <StatusCard
          title="Districts"
          value={String(districtCount)}
          description="Second-level administrative areas"
          icon={GitBranch}
          iconClassName="bg-amber-100 text-amber-700"
        />
        <StatusCard
          title="Secretariat Divisions"
          value={String(divisionCount)}
          description="Third-level administrative areas"
          icon={Layers3}
          iconClassName="bg-violet-100 text-violet-700"
        />
      </div>

      {filteredAreas.length === 0 ? (
        <EmptyState
          title="No areas found"
          description="Try adjusting your search or area type filter."
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
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Administrative Hierarchy</h3>
              <p className="mt-1 text-sm text-slate-500">
                Expand provinces to navigate districts and secretariat divisions
              </p>
            </div>

            <div className="space-y-4">
              {filteredRoots.map((area) => (
                <HierarchyNode
                  key={area._id}
                  area={area}
                  depth={0}
                  allAreas={allAreas}
                  expandedIds={expandedIds}
                  onToggle={toggleExpanded}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredAreas.map((area) => (
              <div
                key={area._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getTypeStyles(
                        area.hierarchyDepth,
                      )}`}
                    >
                      {getHierarchyType(area.hierarchyDepth)}
                    </div>

                    <h3 className="mt-3 text-xl font-semibold text-slate-900">{area.name}</h3>
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
                      Area Type
                    </span>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {getHierarchyType(area.hierarchyDepth)}
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
