import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import FormInput from "@/components/ui/input/form-input";
import FormSelect from "@/components/ui/input/form-select";
import PageHeader from "@/components/ui/page-header";
import Toast from "@/components/ui/toast";
import { ROLE_LABELS, ROLES } from "@/constants/roles";
import { getUserById } from "@/features/users/api/get-user-by-id";
import { updateUser } from "@/features/users/api/update-user";
import { updateUserSchema } from "@/features/users/schemas/update-user-schema";

const roleOptions = [
  { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN] },
  { value: ROLES.WORKER, label: ROLE_LABELS[ROLES.WORKER] },
];

function EditUserPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: Boolean(userId),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      nic: "",
      shift: "",
      role: ROLES.ADMIN,
    },
  });

  const role = useWatch({ control, name: "role" });

  useEffect(() => {
    if (!userQuery.data) return;

    const apiUser = userQuery.data?.data || userQuery.data;
    if (!apiUser) return;

    const resolvedRole = String(apiUser.role || "").toLowerCase();

    reset({
      name: apiUser.name || "",
      email: apiUser.email || "",
      phone: apiUser.workerProfile?.phone || "",
      nic: apiUser.workerProfile?.nic || "",
      shift: apiUser.workerProfile?.shift || apiUser.shift || "",
      role: resolvedRole || ROLES.WORKER,
    });
  }, [userQuery.data, reset]);

  const mutation = useMutation({
    mutationFn: (values) => updateUser(userId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      navigate(`/settings/users/${userId}`);
    },
  });

  const onSubmit = (values) => {
    mutation.mutate({
      name: values.name,
      email: values.email,
      phone: values.phone,
      nic: values.nic,
      shift: values.shift,
      role: values.role,
    });
  };

  if (userQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Loading user details...
      </div>
    );
  }

  if (userQuery.isError) {
    return (
      <Toast
        variant="error"
        title="Failed to load user"
        description="The requested user could not be loaded."
      />
    );
  }

  const currentUser = userQuery.data?.data || userQuery.data;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Edit User"
        description="Update staff account information."
        breadcrumbs={[
          { label: "Settings", to: "/settings" },
          { label: "Users", to: "/settings/users" },
          { label: currentUser?.name || "User", to: `/settings/users/${userId}` },
          { label: "Edit" },
        ]}
      />

      {mutation.isError ? (
        <Toast
          variant="error"
          title="Failed to update user"
          description={
            mutation.error?.response?.data?.message ||
            mutation.error?.message ||
            "Please verify the user details and try again."
          }
        />
      ) : null}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormInput
              label="Full Name"
              name="name"
              placeholder="e.g. John Doe"
              register={register}
              error={errors.name?.message}
              disabled={mutation.isPending}
            />
          </div>

          <div className="md:col-span-2">
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="e.g. john.doe@example.com"
              register={register}
              error={errors.email?.message}
              disabled={mutation.isPending}
            />
          </div>

          <FormSelect
            label="Role"
            name="role"
            register={register}
            error={errors.role?.message}
            options={roleOptions}
            placeholder="Select a role"
            disabled={mutation.isPending}
          />

          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            placeholder="Optional"
            register={register}
            error={errors.phone?.message}
            disabled={mutation.isPending}
          />

          <FormInput
            label="NIC"
            name="nic"
            placeholder="National ID (optional)"
            register={register}
            error={errors.nic?.message}
            disabled={mutation.isPending}
          />

          {role === ROLES.WORKER && (
            <FormInput
              label="Shift"
              name="shift"
              placeholder="e.g. Morning, Evening, Night"
              register={register}
              error={errors.shift?.message}
              disabled={mutation.isPending}
            />
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Updating..." : "Update User"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/settings/users/${userId}`)}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUserPage;
