import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import SectionCard from "@/components/ui/card/section-card";
import StatusCard from "@/components/ui/card/status-card";
import FilterChips from "@/components/ui/filter-chips";
import EmptyState from "@/components/ui/empty-state";
import { ROLE_LABELS, ROLES } from "@/constants/roles";

const roleStats = [
  {
    title: "Total Roles",
    value: "3",
    description: "Defined access roles",
    icon: ShieldCheck,
    iconClassName: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Permission Groups",
    value: "6",
    description: "Operational and administrative access groups",
    icon: KeyRound,
    iconClassName: "bg-amber-100 text-amber-700",
  },
];

const roles = [
  {
    id: 1,
    name: ROLES.SUPERADMIN,
    scope: "Full system control",
    permissions: [
      "Full dashboard access",
      "Manage areas",
      "Manage bins",
      "View telemetry",
      "View alerts",
      "View analytics",
      "Manage users",
      "Manage roles",
      "Security settings",
      "Appearance settings",
    ],
    type: "system",
  },
  {
    id: 2,
    name: ROLES.ADMIN,
    scope: "Administrative and operational control",
    permissions: [
      "View dashboard",
      "Manage areas",
      "Manage bins",
      "View telemetry",
      "View alerts",
      "View analytics",
      "View users",
      "View roles",
      "Security settings",
      "Appearance settings",
    ],
    type: "system",
  },
  {
    id: 3,
    name: ROLES.WORKER,
    scope: "Operational access",
    permissions: [
      "View dashboard",
      "View areas",
      "View bins",
      "View telemetry",
      "View alerts",
      "View analytics",
      "View own profile",
      "View notifications",
    ],
    type: "system",
  },
];

const filters = [
  { label: "All", value: "all" },
  { label: "System", value: "system" },
];

function getRoleBadgeClass(role) {
  switch (role) {
    case ROLES.SUPERADMIN:
      return "bg-rose-100 text-rose-700";
    case ROLES.ADMIN:
      return "bg-sky-100 text-sky-700";
    default:
      return "bg-emerald-100 text-emerald-700";
  }
}

function RolesPage() {
  const [filter, setFilter] = useState("all");

  const filteredRoles = roles.filter((role) => {
    if (filter === "all") return true;
    return role.type === filter;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Roles & Permissions"
        description="Define access levels and permission groupings for system users."
        breadcrumbs={[{ label: "Settings", to: "/settings" }, { label: "Roles & Permissions" }]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {roleStats.map((item) => (
          <StatusCard key={item.title} {...item} />
        ))}
      </div>

      <SectionCard title="Roles" description="Review available access roles for the system.">
        <div className="space-y-4">
          <FilterChips options={filters} value={filter} onChange={setFilter} />

          {filteredRoles.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No roles found"
              description="No roles match the selected filter."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredRoles.map((role) => (
                <div key={role.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeClass(
                          role.name,
                        )}`}
                      >
                        {ROLE_LABELS[role.name] || role.name}
                      </span>

                      <h3 className="mt-3 text-lg font-semibold text-slate-900">
                        {ROLE_LABELS[role.name] || role.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">{role.scope}</p>
                    </div>

                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                      {role.type}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2">
                    {role.permissions.map((permission) => (
                      <div
                        key={permission}
                        className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-slate-700"
                      >
                        {permission}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

export default RolesPage;
