import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

function PageHeader({ eyebrow, title, description, actions, breadcrumbs = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {breadcrumbs.length > 0 ? (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          {breadcrumbs.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.to ? (
                <Link to={item.to} className="transition hover:text-slate-700">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-700">{item.label}</span>
              )}

              {index < breadcrumbs.length - 1 ? (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          {eyebrow ? <p className="text-sm font-medium text-emerald-600">{eyebrow}</p> : null}

          <h2 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h2>

          {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
        </div>

        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}

export default PageHeader;
