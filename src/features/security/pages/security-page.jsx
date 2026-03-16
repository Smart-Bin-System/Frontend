import { KeyRound, Laptop, ShieldCheck, Smartphone } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import SectionCard from "@/components/ui/card/section-card";

function SecurityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="System Security"
        title="Security"
        description="Manage password policies, session protection, and account security preferences."
        breadcrumbs={[{ label: "Settings", to: "/settings" }, { label: "Security" }]}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Password Settings">
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-700">
                <KeyRound className="h-4 w-4" />
                <p className="text-sm font-medium">Password Policy</p>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Minimum 8 characters, at least one uppercase, one number, and one special character.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Change Password
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Authentication">
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-sm font-medium">Two-Factor Authentication</p>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Enable additional protection for administrator sign-in.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Enable 2FA
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Session Activity">
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-700">
                <Laptop className="h-4 w-4" />
                <p className="text-sm font-medium">Web Session</p>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Chrome on Windows · Colombo · Active now
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-700">
                <Smartphone className="h-4 w-4" />
                <p className="text-sm font-medium">Mobile Session</p>
              </div>
              <p className="mt-2 text-sm text-slate-500">No active mobile sessions detected.</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default SecurityPage;
