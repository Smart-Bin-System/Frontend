import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormInput from "@/components/ui/input/form-input";
import FormSelect from "@/components/ui/input/form-select";
import PageHeader from "@/components/ui/page-header";
import Toast from "@/components/ui/toast";
import { getAreaById } from "@/features/areas/api/get-area-by-id";
import { getAreaList } from "@/features/areas/api/get-area-list";
import { updateArea } from "@/features/areas/api/update-area";
import { createAreaSchema } from "@/features/areas/schemas/create-area-schema";

function EditAreaPage() {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const areaQuery = useQuery({
    queryKey: ["area", areaId],
    queryFn: () => getAreaById(areaId),
    enabled: Boolean(areaId),
  });

  const areasQuery = useQuery({
    queryKey: ["areas"],
    queryFn: getAreaList,
  });

  const area = useMemo(() => areaQuery.data?.data || null, [areaQuery.data]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAreaSchema),
    values: {
      name: area?.name || "",
      code: area?.code || "",
      parentAreaId: area?.parentAreaId || "",
    },
  });

  const mutation = useMutation({
    mutationFn: ({ id, payload }) => updateArea(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      queryClient.invalidateQueries({ queryKey: ["area", areaId] });
      navigate(`/areas/${areaId}`);
    },
  });

  const allAreas = areasQuery.data?.data || [];
  const areaOptions = allAreas
    .filter((item) => item.id !== areaId)
    .map((item) => ({
      value: item.id,
      label: item.name,
    }));

  const onSubmit = (values) => {
    mutation.mutate({
      id: areaId,
      payload: {
        name: values.name,
        code: values.code,
        parentAreaId: values.parentAreaId || null,
      },
    });
  };

  if (areaQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Loading area data...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Area Management"
        title="Edit Area"
        description="Update operational area information."
        breadcrumbs={[
          { label: "Areas", to: "/areas" },
          { label: area?.name || "Area", to: `/areas/${areaId}` },
          { label: "Edit" },
        ]}
      />

      {mutation.isError ? (
        <Toast
          variant="error"
          title="Failed to update area"
          description={
            mutation.error?.response?.data?.message ||
            mutation.error?.message ||
            "Please try again."
          }
        />
      ) : null}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5">
          <FormInput
            label="Area Name"
            name="name"
            placeholder="e.g. Malabe Campus"
            register={register}
            error={errors.name?.message}
            disabled={mutation.isPending}
          />

          <FormInput
            label="Area Code"
            name="code"
            placeholder="e.g. MLB"
            register={register}
            error={errors.code?.message}
            disabled={mutation.isPending}
          />

          <FormSelect
            label="Parent Area"
            name="parentAreaId"
            register={register}
            error={errors.parentAreaId?.message}
            options={areaOptions}
            placeholder="No parent area"
            disabled={mutation.isPending || areasQuery.isLoading}
          />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => reset()}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => navigate(`/areas/${areaId}`)}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAreaPage;
