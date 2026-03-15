import { Link } from "react-router";
import { ArrowLeft, ShieldX } from "lucide-react";

function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-amber-700">
          <ShieldX className="h-8 w-8" />
        </div>

        <p className="mt-6 text-sm font-medium uppercase tracking-wider text-amber-600">
          Access Restricted
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">You do not have permission</h1>
        <p className="mt-3 text-sm text-slate-500">
          Your current role does not allow access to this page.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccessDeniedPage;
