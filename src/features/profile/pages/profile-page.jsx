import { Mail, Phone, Shield, UserCircle2 } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import SectionCard from "@/components/ui/card/section-card";

function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="View administrator account details and profile information."
        breadcrumbs={[{ label: "Settings", to: "/settings" }, { label: "Profile" }]}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <SectionCard title="Profile Summary">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <UserCircle2 className="h-12 w-12" />
            </div>

            <h3 className="mt-4 text-xl font-semibold text-slate-900">Mihashi</h3>
            <p className="mt-1 text-sm text-slate-500">System Administrator</p>

            <button
              type="button"
              className="mt-5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Edit Profile
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Contact Information">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Mail className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Email</span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-900">mihashi@example.com</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Phone className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Phone</span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-900">+94 71 234 5678</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 md:col-span-2">
              <div className="flex items-center gap-2 text-slate-500">
                <Shield className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Role</span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-900">System Administrator</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default ProfilePage;
