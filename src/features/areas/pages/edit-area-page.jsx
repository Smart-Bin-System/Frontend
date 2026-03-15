import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";
import FormInput from "@/components/ui/input/form-input";
import FormTextarea from "@/components/ui/input/form-textarea";
import PageHeader from "@/components/ui/page-header";
import { createAreaSchema } from "@/features/areas/schemas/create-area-schema";

const fallbackArea = {
  _id: "1",
  name: "Malabe Campus",
  description: "Main campus smart waste collection area",
  address: "Malabe main academic zone",
};

const getAreaById = async (areaId) => {
  const response = await axiosClient.get(`/areas/${areaId}`);
  return response.data;
};

const updateArea = async ({ areaId, payload }) => {
  const response = await axiosClient.put(`/areas/${areaId}`, payload);
  return response.data;
};

function EditAreaPage() {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const areaQuery = useQuery({
    queryKey: ["area", areaId],
    queryFn: () => getAreaById(areaId),
    enabled: Boolean(areaId),
  });

  const area = useMemo(
    () => areaQuery.data?.data || areaQuery.data || fallbackArea,
    [areaQuery.data],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAreaSchema),
    values: {
      name: area.name || "",
      description: area.description || "",
      address: area.address || "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      queryClient.invalidateQueries({ queryKey: ["area", areaId] });
      navigate(`/areas/${areaId}`);
    },
  });

  const onSubmit = (values) => {
    mutation.mutate({ areaId, payload: values });
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
          { label: area.name || "Area", to: `/areas/${areaId}` },
          { label: "Edit" },
        ]}
      />

      {areaQuery.isError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Failed to load this area from the API. Showing fallback sample data.
        </div>
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

          <FormTextarea
            label="Description"
            name="description"
            placeholder="Describe the purpose of this area"
            register={register}
            error={errors.description?.message}
            disabled={mutation.isPending}
          />

          <FormInput
            label="Address"
            name="address"
            placeholder="Optional address or location description"
            register={register}
            error={errors.address?.message}
            disabled={mutation.isPending}
          />
        </div>

        {mutation.isError ? (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            Failed to update area. Please try again.
          </div>
        ) : null}

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
