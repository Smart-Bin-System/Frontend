import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

const variantMap = {
  success: {
    icon: CheckCircle2,
    classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  error: {
    icon: XCircle,
    classes: "border-rose-200 bg-rose-50 text-rose-700",
  },
  warning: {
    icon: AlertTriangle,
    classes: "border-amber-200 bg-amber-50 text-amber-700",
  },
  info: {
    icon: Info,
    classes: "border-sky-200 bg-sky-50 text-sky-700",
  },
};

function Toast({ title, description, variant = "info" }) {
  const config = variantMap[variant] || variantMap.info;
  const Icon = config.icon;

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${config.classes}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5" />
        <div>
          <h4 className="text-sm font-semibold">{title}</h4>
          {description ? <p className="mt-1 text-sm opacity-90">{description}</p> : null}
        </div>
      </div>
    </div>
  );
}

export default Toast;
