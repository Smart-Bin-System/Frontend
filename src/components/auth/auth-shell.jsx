import { Link } from "react-router";
import { Boxes } from "lucide-react";

function AuthShell({ title, description, children, footer }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="hidden w-1/2 bg-slate-950 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Mihashi Smart Bin</h1>
              <p className="text-sm text-slate-400">Waste Management Console</p>
            </div>
          </div>
        </div>

        <div className="px-10 pb-16">
          <h2 className="max-w-md text-4xl font-semibold leading-tight">
            Smarter waste monitoring for connected operational environments.
          </h2>
          <p className="mt-4 max-w-md text-sm text-slate-400">
            Track smart bins, monitor telemetry, review alerts, and manage areas from one clean
            dashboard.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 lg:hidden">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Boxes className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Mihashi Smart Bin</h1>
                <p className="text-sm text-slate-500">Waste Management Console</p>
              </div>
            </Link>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
          </div>

          <div className="mt-6">{children}</div>

          {footer ? <div className="mt-6">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

export default AuthShell;
