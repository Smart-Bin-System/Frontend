import { Link } from "react-router";
import { Bell, Lock, Palette, ShieldCheck, UserCog, Users } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import SectionCard from "@/components/ui/card/section-card";

const settingSections = [
  {
    title: "Account Preferences",
    description: "Manage profile preferences and personal settings.",
    icon: UserCog,
    to: "/settings/profile",
  },
  {
    title: "Security",
    description: "Update password policies and account protection settings.",
    icon: Lock,
    to: "/settings/security",
  },
  {
    title: "Notifications",
    description: "Control alert delivery and notification preferences.",
    icon: Bell,
    to: "/settings/notifications",
  },
  {
    title: "Appearance",
    description: "Adjust theme and interface presentation options.",
    icon: Palette,
    to: "/settings/appearance",
  },
  {
    title: "Users",
    description: "Manage staff accounts and user access.",
    icon: Users,
    to: "/settings/users",
  },
  {
    title: "Roles & Permissions",
    description: "Manage role definitions and permission structures.",
    icon: ShieldCheck,
    to: "/settings/roles",
  },
];

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="System Configuration"
        title="Settings"
        description="Manage global preferences for Mihashi’s Smart Waste Management System."
        breadcrumbs={[{ label: "Settings" }]}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {settingSections.map((item) => {
          const Icon = item.icon;

          return (
            <SectionCard key={item.title}>
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{item.description}</p>

                  <Link
                    to={item.to}
                    className="mt-4 inline-block rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Configure
                  </Link>
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}

export default SettingsPage;
