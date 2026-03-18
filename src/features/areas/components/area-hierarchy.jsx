import { Link } from "react-router";
import { ChevronRight, FolderTree, MapPinned } from "lucide-react";
import { buildAreaTree, getAreaDepthLabel } from "@/features/areas/utils/area-tree";

function AreaNode({ node, level = 0 }) {
  return (
    <div className="space-y-3">
      <div
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
              <MapPinned className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                {getAreaDepthLabel(level)}
              </p>
              <h4 className="mt-1 text-sm font-semibold text-slate-900">{node.name}</h4>
              <p className="mt-1 text-xs text-slate-500">Code: {node.code}</p>
            </div>
          </div>

          <Link
            to={`/areas/${node._id}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 transition hover:text-slate-900"
          >
            View
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {node.children?.length > 0 && (
        <div className="space-y-3">
          {node.children.map((child) => (
            <AreaNode key={child._id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function AreaHierarchy({ areas = [] }) {
  const tree = buildAreaTree(areas);

  if (!tree.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
        No area hierarchy available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tree.map((node) => (
        <AreaNode key={node._id} node={node} />
      ))}
    </div>
  );
}

export default AreaHierarchy;
