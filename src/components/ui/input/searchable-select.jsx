import { useEffect, useMemo, useRef, useState } from "react";

function SearchableSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return options;

    return options.filter((option) => option.label.toLowerCase().includes(term));
  }, [options, search]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <label className="block text-sm font-medium text-slate-700">{label}</label>

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className={`w-full rounded-xl border px-4 py-3 text-left text-sm outline-none transition ${
            error
              ? "border-rose-300 bg-rose-50 text-slate-900"
              : "border-slate-200 bg-white text-slate-900"
          } ${disabled ? "cursor-not-allowed bg-slate-100" : ""}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </button>

        {open && !disabled ? (
          <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500"
            />

            <div className="max-h-56 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-slate-500">No results found</div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

export default SearchableSelect;
