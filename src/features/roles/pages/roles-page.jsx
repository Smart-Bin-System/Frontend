import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import SectionCard from "@/components/ui/card/section-card";
import StatusCard from "@/components/ui/card/status-card";
import FilterChips from "@/components/ui/filter-chips";
import EmptyState from "@/components/ui/empty-state";

const roleStats = [
  {
    title: "Total Roles",
    value: "4",
    description: "Defined access profiles",
    icon: ShieldCheck,
    iconClassName: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Permission Groups",
    value: "12",
    description: "Feature access groupings",
    icon: KeyRound,
    iconClassName: "bg-amber-100 text-amber-700",
  },
];

const roles = [
  {
    id: 1,
    name: "Admin",
    scope: "Full access",
    permissions: [
      "Dashboard",
      "Areas",
      "Bins",
      "Telemetry",
      "Alerts",
      "Analytics",
      "Users",
      "Roles",
    ],
    type: "system",
  },
  {
    id: 2,
    name: "Operator",
    scope: "Operational access",
    permissions: ["Dashboard", "Areas", "Bins", "Telemetry", "Alerts"],
    type: "system",
  },
  {
    id: 3,
    name: "Viewer",
    scope: "Read-only access",
    permissions: ["Dashboard", "Analytics", "Alerts"],
    type: "system",
  },
  {
    id: 4,
    name: "Supervisor",
    scope: "Review and management",
    permissions: ["Dashboard", "Areas", "Bins", "Alerts", "Analytics"],
    type: "custom",
  },
];

const filters = [
  { label: "All", value: "all" },
  { label: "System", value: "system" },
  { label: "Custom", value: "custom" },
];

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

      <SectionCard title="Roles" description="Review and compare available access roles.">
        <div className="space-y-4">
          <FilterChips options={filters} value={filter} onChange={setFilter} />

          {filteredRoles.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No roles found"
              description="No roles match the selected filter."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredRoles.map((role) => (
                <div key={role.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{role.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{role.scope}</p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        role.type === "system"
                          ? "bg-sky-100 text-sky-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {role.type}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {permission}
                      </span>
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
