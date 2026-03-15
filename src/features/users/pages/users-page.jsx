import { useState } from "react";
import { Link } from "react-router";
import { Plus, UserCog, Users } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import SectionCard from "@/components/ui/card/section-card";
import StatusCard from "@/components/ui/card/status-card";
import TableToolbar from "@/components/ui/table/table-toolbar";
import FilterChips from "@/components/ui/filter-chips";
import PaginationFooter from "@/components/ui/pagination-footer";
import EmptyState from "@/components/ui/empty-state";

const userStats = [
  {
    title: "Total Users",
    value: "12",
    description: "Registered staff accounts",
    icon: Users,
    iconClassName: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Admins",
    value: "3",
    description: "Full system access",
    icon: UserCog,
    iconClassName: "bg-sky-100 text-sky-700",
  },
];

const users = [
  {
    id: 1,
    name: "Mihashi",
    email: "mihashi@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Pasindu",
    email: "pasindu@example.com",
    role: "Operator",
    status: "Active",
  },
  {
    id: 3,
    name: "Kavindu",
    email: "kavindu@example.com",
    role: "Viewer",
    status: "Inactive",
  },
];

const filters = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

function UsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" || user.status.toLowerCase() === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Users"
        description="Manage staff accounts for Mihashi’s Smart Waste Management System."
        breadcrumbs={[{ label: "Settings", to: "/settings" }, { label: "Users" }]}
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {userStats.map((item) => (
          <StatusCard key={item.title} {...item} />
        ))}
      </div>

      <SectionCard title="User Directory" description="Review and manage all user accounts.">
        <div className="space-y-4">
          <TableToolbar
            title="Users"
            description="Search and filter staff accounts"
            searchPlaceholder="Search users..."
            searchValue={search}
            onSearchChange={(event) => setSearch(event.target.value)}
          />

          <FilterChips options={filters} value={filter} onChange={setFilter} />

          {filteredUsers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No users found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-4 font-medium">Name</th>
                    <th className="px-4 py-4 font-medium">Email</th>
                    <th className="px-4 py-4 font-medium">Role</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 last:border-b-0">
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                        {user.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">{user.email}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{user.role}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <PaginationFooter
            page={1}
            totalPages={1}
            totalItems={filteredUsers.length}
            onPrev={() => {}}
            onNext={() => {}}
          />
        </div>
      </SectionCard>
    </div>
  );
}

export default UsersPage;
