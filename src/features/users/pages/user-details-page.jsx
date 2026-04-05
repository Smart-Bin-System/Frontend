import { useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, RefreshCw, Trash2 } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import ConfirmModal from "@/components/ui/modal/confirm-modal";
import Toast from "@/components/ui/toast";
import { ROLE_LABELS, ROLES } from "@/constants/roles";
import { getUserById } from "@/features/users/api/get-user-by-id";
import { deleteUser } from "@/features/users/api/delete-user";

function getRoleBadgeClass(role) {
  switch (role) {
    case ROLES.ADMIN:
      return "bg-sky-100 text-sky-700";
    case ROLES.WORKER:
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function UserDetailsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: Boolean(userId),
  });

  const user = useMemo(() => {
    const apiUser = data?.data || data;

    if (!apiUser || typeof apiUser !== "object") {
      return {
        name: "Unknown User",
        email: "N/A",
        role: ROLES.WORKER,
        phone: "N/A",
        nic: "N/A",
        shift: "N/A",
        createdAt: "N/A",
      };
    }

    const resolvedRole = String(apiUser.role || "").toLowerCase();
    const statusLabel =
      typeof apiUser.status === "boolean"
        ? apiUser.status
          ? "Active"
          : "Inactive"
        : String(apiUser.status || "active").toLowerCase() === "active"
          ? "Active"
          : "Inactive";

    return {
      ...apiUser,
      name: apiUser.name || "Unnamed User",
      email: apiUser.email || "N/A",
      role: resolvedRole || ROLES.WORKER,
      phone: apiUser.workerProfile?.phone || "N/A",
      nic: apiUser.workerProfile?.nic || "N/A",
      shift: apiUser.workerProfile?.shift || apiUser.shift || "N/A",
      status: statusLabel,
      createdAt: apiUser.createdAt ? new Date(apiUser.createdAt).toLocaleDateString() : "N/A",
    };
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/settings/users");
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Loading user details...
      </div>
    );
  }

  if (isError) {
    return (
      <Toast
        variant="error"
        title="Failed to load user"
        description="The requested user could not be loaded."
      />
    );
  }

  return (
    <div className="space-y-6">
      {deleteMutation.isError ? (
        <Toast
          variant="error"
          title="Failed to delete user"
          description={
            deleteMutation.error?.response?.data?.message ||
            deleteMutation.error?.message ||
            "Please try again."
          }
        />
      ) : null}

      <PageHeader
        eyebrow={user.email}
        title={user.name}
        description={`Role: ${ROLE_LABELS[user.role] || user.role}`}
        breadcrumbs={[{ label: "Users", to: "/settings/users" }, { label: user.name }]}
        actions={
          <>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <Link
              to={`/settings/users/${userId}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" />
              Edit User
            </Link>

            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">User Information</h3>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Full Name</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{user.name}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Email</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{user.email}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Phone</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{user.phone}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">NIC</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{user.nic}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Account Details</h3>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Role</p>
              <div className="mt-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeClass(
                    user.role,
                  )}`}
                >
                  {ROLE_LABELS[user.role] || user.role}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Status</p>
              <div className="mt-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    user.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>

            {user.role === ROLES.WORKER && (
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">Shift</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{user.shift}</p>
              </div>
            )}

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Created</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{user.createdAt}</p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={deleteOpen}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={() => {
          deleteMutation.mutate();
          setDeleteOpen(false);
        }}
        onCancel={() => setDeleteOpen(false)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

export default UserDetailsPage;
