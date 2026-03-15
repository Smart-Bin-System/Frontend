import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

function ActionMenu({ items = [] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setOpen(false);
                item.onClick?.();
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-50 ${
                item.danger ? "text-rose-700" : "text-slate-700"
              }`}
            >
              {item.icon ? <item.icon className="h-4 w-4" /> : null}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ActionMenu;
