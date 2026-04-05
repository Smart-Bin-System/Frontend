import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Plus, RefreshCw, UserCog, Users } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import SectionCard from "@/components/ui/card/section-card";
import StatusCard from "@/components/ui/card/status-card";
import TableToolbar from "@/components/ui/table/table-toolbar";
import FilterChips from "@/components/ui/filter-chips";
import PaginationFooter from "@/components/ui/pagination-footer";
import EmptyState from "@/components/ui/empty-state";
import PageSkeleton from "@/components/ui/page-skeleton";
import { ROLE_LABELS, ROLES } from "@/constants/roles";
import { getUsers } from "@/features/users/api/get-users";

const filters = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
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

function normalizeUser(user, index) {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  const resolvedRole = String(user?.role || "").toLowerCase();
  const rawStatus = user?.status ?? user?.isActive;

  const statusLabel =
    typeof rawStatus === "boolean"
      ? rawStatus
        ? "Active"
        : "Inactive"
      : String(rawStatus || "inactive").toLowerCase() === "active"
        ? "Active"
        : "Inactive";

  return {
    id: user?._id || user?.id || user?.email || `user-${index}`,
    name: user?.name || fullName || "N/A",
    email: user?.email || "N/A",
    role: resolvedRole || ROLES.WORKER,
    status: statusLabel,
  };
}

function UsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const allUsers = useMemo(() => {
    const responseUsers = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    return responseUsers.map(normalizeUser);
  }, [data]);

  const userStats = useMemo(() => {
    const adminCount = allUsers.filter((user) => {
      return user.role === ROLES.SUPERADMIN || user.role === ROLES.ADMIN;
    }).length;

    return [
      {
        title: "Total Users",
        value: String(allUsers.length),
        description: "Registered staff accounts",
        icon: Users,
        iconClassName: "bg-emerald-100 text-emerald-700",
      },
      {
        title: "Admins",
        value: String(adminCount),
        description: "Super admins and admins",
        icon: UserCog,
        iconClassName: "bg-sky-100 text-sky-700",
      },
    ];
  }, [allUsers]);

  const filteredUsers = allUsers.filter((user) => {
    const roleLabel = ROLE_LABELS[user.role] || user.role;

    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      roleLabel.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" || user.status.toLowerCase() === filter;

    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return <PageSkeleton cards={2} rows={5} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Users"
        description="Manage staff accounts for Mihashi’s Smart Waste Management System."
        breadcrumbs={[{ label: "Settings", to: "/settings" }, { label: "Users" }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <Link
              to="/settings/users/new"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add User
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {userStats.map((item) => (
          <StatusCard key={item.title} {...item} />
        ))}
      </div>

      <SectionCard title="User Directory" description="Review and manage all user accounts.">
        <div className="space-y-4">
          {isError && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
              Failed to load users from the API.
            </div>
          )}

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
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeClass(
                            user.role,
                          )}`}
                        >
                          {ROLE_LABELS[user.role] || user.role}
                        </span>
                      </td>
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
                          <Link
                            to={`/settings/users/${user.id}`}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            View
                          </Link>
                          <Link
                            to={`/settings/users/${user.id}/edit`}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            Edit
                          </Link>
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
