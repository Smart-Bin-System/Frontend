import { CheckCircle2, Mail, MapPinned, Phone, Shield, UserCircle2, XCircle } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import SectionCard from "@/components/ui/card/section-card";
import { useAuth } from "@/context/auth-context";
import { ROLE_LABELS, ROLES } from "@/constants/roles";

function ProfilePage() {
  const { user } = useAuth();

  const roleLabel = ROLE_LABELS[user?.role] || "User";
  const workerProfile = user?.workerProfile || {};
  const areaCount = Array.isArray(user?.areaIds) ? user.areaIds.length : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="View authenticated account details and profile information."
        breadcrumbs={[{ label: "Settings", to: "/settings" }, { label: "Profile" }]}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <SectionCard title="Profile Summary">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <UserCircle2 className="h-12 w-12" />
            </div>

            <h3 className="mt-4 text-xl font-semibold text-slate-900">{user?.name || "User"}</h3>
            <p className="mt-1 text-sm text-slate-500">{roleLabel}</p>

            <div className="mt-4">
              {user?.isActive ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  <XCircle className="h-3.5 w-3.5" />
                  Inactive
                </span>
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Account Information">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Mail className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Email</span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {user?.email || "No email available"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Shield className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Role</span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-900">{roleLabel}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <span className="text-xs uppercase tracking-wider text-slate-500">Locale</span>
              <p className="mt-2 text-sm font-medium text-slate-900">{user?.locale || "en-US"}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <MapPinned className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Assigned Areas</span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-900">{areaCount}</p>
            </div>
          </div>
        </SectionCard>
      </div>

      {user?.role === ROLES.WORKER && (
        <SectionCard title="Worker Profile">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Phone className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Phone</span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {workerProfile.phone || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <span className="text-xs uppercase tracking-wider text-slate-500">NIC</span>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {workerProfile.nic || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <span className="text-xs uppercase tracking-wider text-slate-500">Shift</span>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {workerProfile.shift || "Not assigned"}
              </p>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

export default ProfilePage;
