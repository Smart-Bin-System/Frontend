import { Inbox } from "lucide-react";

function EmptyState({
  title = "No data found",
  description = "There is nothing to display right now.",
  icon: Icon = Inbox,
  action,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
