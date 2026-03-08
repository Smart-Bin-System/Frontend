import { Wifi, WifiOff } from "lucide-react";

function BinStatusBadge({ status = "offline" }) {
  const isOnline = status === "online";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        isOnline ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
      }`}
    >
      {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
      {status}
    </span>
  );
}

export default BinStatusBadge;
