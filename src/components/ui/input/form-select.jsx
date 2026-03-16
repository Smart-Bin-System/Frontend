function FormSelect({
  label,
  name,
  register,
  error,
  options = [],
  placeholder = "Select an option",
  disabled = false,
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        id={name}
        disabled={disabled}
        {...register(name)}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition ${
          error
            ? "border-rose-300 bg-rose-50 focus:border-rose-500"
            : "border-slate-200 bg-white focus:border-emerald-500"
        } ${disabled ? "cursor-not-allowed bg-slate-100" : ""}`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

export default FormSelect;
