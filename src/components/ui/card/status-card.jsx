function StatusCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName = "bg-emerald-100 text-emerald-700",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900">{value}</h3>
          {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
        </div>

        {Icon ? (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClassName}`}
          >
            <Icon className="h-6 w-6" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default StatusCard;
