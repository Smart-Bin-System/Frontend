function FormInput({ label, name, type = "text", placeholder, register, error, disabled = false }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
          error
            ? "border-rose-300 bg-rose-50 focus:border-rose-500"
            : "border-slate-200 bg-white focus:border-emerald-500"
        } ${disabled ? "cursor-not-allowed bg-slate-100" : ""}`}
      />

      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

export default FormInput;
