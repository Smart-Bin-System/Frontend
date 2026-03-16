function SummaryRow({ items = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
          {item.description ? (
            <p className="mt-1 text-xs text-slate-500">{item.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default SummaryRow;
